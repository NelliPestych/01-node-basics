const express = require("express");
const ContactController = require("./contact.controller");

const ContactRouter = express.Router();

ContactRouter.get("/", ContactController.listContacts);

ContactRouter.get("/:contactId", ContactController.validateId, ContactController.getById);

ContactRouter.post(
  "/",
  ContactController.addContact
);

ContactRouter.delete("/:contactId", ContactController.validateId, ContactController.removeContact);

ContactRouter.patch(
  "/:contactId",
  ContactController.validateId,
  ContactController.updateContact
);

console.log("ContactRouter", ContactRouter);

module.exports = ContactRouter;
