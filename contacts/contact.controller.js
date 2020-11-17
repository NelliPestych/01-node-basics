const Joi = require("joi");
const contactModel = require('./contact.model');
const { Types: { ObjectId } } = require('mongoose');

class ContactController {
  async listContacts(req, res, next) {
  try {
    const contacts = await contactModel.find();
    return res.status(200).json(contacts);
  } catch (err) {
    next(err);
  }  
  }

  async addContact(req, res, next) {
    try {
      const newContact = await contactModel.create(req.body);
      return res.status(201).json(newContact);
    } catch (err) {
      next(err);
    }  
  }

  async updateContact(req, res, next) {
    try {
      const id = req.params.contactId;
      const contactToUpdate = await contactModel.findContactByIdAndUpdate(
        id,
        req.body
        );

     if (!contactToUpdate) {
       return res.status(404).send();
     }
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  async removeContact(req, res, next) {
    try {
    const id = req.params.contactId;
    const deletedContact = await contactModel.findByIdAndDelete(id);
    if (!deletedContact) {
      return res.status(404).send();
    }
    return res.status(204).json({ message: "contact deleted" });
  } catch (err) {
    next(err);
  }
  }

  async getById(req, res, next) {
    try {
    const id = req.params.contactId;
    const targetContact = await contactModel.findById(id);
    if (!targetContact) {
      return res.status(404).send();
    }
    return res.status(200).json(targetContact);
  } catch (err) {
    next(err);
  }
  }

  validateId(req, res, next) {
    const { contactId } = req.params;

    if (!ObjectId.isValid(contactId)) {
      return res.status(400).send();
    }
    next();
  }
}

module.exports = new ContactController();
