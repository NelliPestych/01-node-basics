const express = require("express");
const UserController = require("./user.controller");
const { upload } = require("./user.helper");
const UserRouter = express.Router();

UserRouter.post(
  "/auth/register",
  UserController.validateSignIn,
  UserController._addUser
);

UserRouter.get("/users", UserController._getUsers);

UserRouter.get("/users/:id", UserController.validateId, UserController._getById);

UserRouter.post(
  "/auth/login",
  UserController.validateSignIn,
  UserController._signIn
);

UserRouter.post(
  "/auth/logout",
  UserController.authorize,
  UserController.logout
);

UserRouter.get(
  "/users/current",
  UserController.authorize,
  UserController._getCurrentUser
);

UserRouter.patch(
  "/users/avatars",
  UserController.authorize,
  upload.single("avatar"),
  UserController._addAvatar
);

UserRouter.patch(
  "/users/:id",
  UserController.authorize,
  UserController.updateUser
);

module.exports = UserRouter;
