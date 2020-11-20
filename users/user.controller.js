const Joi = require("joi");
const userModel = require("./user.model");
const bcrypt = require("bcrypt");
const { UnauthorizedError } = require("../api/helpers/errors.constructor");
const jwt = require("jsonwebtoken");
const { Avatar, removeAvatar, minifyImage } = require("./user.helper");
const {
  Types: { ObjectId },
} = require("mongoose");

require("dotenv").config();

class UserController {
  get addUser() {
    return this._addUser.bind(this);
  }

  get getById() {
    return this._getById.bind(this);
  }

  get getUsers() {
    return this._getUsers.bind(this);
  }

  get getCurrentUser() {
    return this._getCurrentUser.bind(this);
  }

  get signIn() {
    return this._signIn.bind(this);
  }

  get addAvatar() {
    return this._addAvatar.bind(this);
  }

  async _getUsers(req, res, next) {
    try {
      const users = await userModel.find();
      return res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  }

  async _addUser(req, res, next) {
    try {
      const { email, password } = req.body;
      const saltRounds = 1;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const existingUser = await userModel.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).send("Email in use");
      }

      await Avatar(email);
      await minifyImage();
      await removeAvatar(`${email}.png`);

      const user = await userModel.create({
        email,
        avatarURL: `http://localhost:3000/images/${email}.png`,
        password: passwordHash,
      });
      return res.status(201).json({
        user: {
          email: user.email,
          avatarURL: user.avatarURL,
          subscription: user.subscription,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async _signIn(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await userModel.findUserByEmail(email);
      if (!user) {
        return res.status(401).send("Authentication failed");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).send("Authentication failed");
      }

      const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });
      await userModel.updateToken(user._id, token);
      const token = await this.checkUser(email, password);
      return res.status(200).json({
        token: token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async authorize(req, res, next) {
    try {
      const authorizationHeader = req.get("Authorization");
      const token = authorizationHeader.replace("Bearer ", "");
      let userId;
      try {
        userId = await jwt.verify(token, process.env.JWT_SECRET).id;
      } catch (err) {
        next(new UnauthorizedError("User not authorized"));
      }
      const user = await userModel.findById(userId);
      if (!user || user.token !== token) {
        throw new UnauthorizedError();
      }
      req.user = user;
      req.token = token;

      next();
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const user = req.user;
      await userModel.updateToken(user._id, null);
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  async _getCurrentUser(req, res, next) {
    try {
      const [userForResponse] = this.prepareUsersResponse([req.user]);
      return res.status(200).json(userForResponse);
    } catch (err) {
      next(err);
    }
  }

  async updateUser(req, res, next) {
    try {
      const user = await userModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({
        email: user.email,
        subscription: user.subscription,
      });
    } catch (err) {
      next(err);
    }
  }

  async _addAvatar(req, res, next) {
    try {
      await minifyImage();
      await removeAvatar(req.file.filename);
      return res.status(200).json({
        avatarURL: `http://localhost:3000/images/${req.file.filename}`,
      });
    } catch (err) {
      next(err);
    }
  }

  async _getById(req, res, next) {
    try {
      const userId = req.params.id;
      const targetUser = await userModel.findById(userId);
      if (!targetUser) {
        return res.status(404).send();
      }

      const [userForResponse] = this.prepareUsersResponse([user]);
      return res.status(200).json(userForResponse);
    } catch (err) {
      next(err);
    }
  }

  validateId(req, res, next) {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send();
    }
    next();
  }

  validateSignIn(req, res, next) {
    const signInRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    const result = signInRules.validate(req.body);
    if (result.error) {
      return res.status(400).send(result.error.details);
    }
    next();
  }

  prepareUsersResponse(users) {
    return users.map((user) => {
      const { email, subscription, _id } = user;
      return { id: _id, email, subscription };
    });
  }
}

module.exports = new UserController();
