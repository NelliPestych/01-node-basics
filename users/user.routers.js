const express = require("express");
const UserController = require("./user.controller");

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
  UserController.signIn
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
  "/users/:id",
  UserController.authorize,
  UserController.updateUser
);

console.log("UserRouter", UserRouter);

module.exports = UserRouter;
