const fs = require("fs");
const yargs = require('yargs');
const importFunction = require('./contacts.js');


// index.js

const argv = yargs
.number("id")
.string("name")
.string("email")
.string("phone").argv;

// TODO: рефакторить
function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case 'list':
      importFunction.listContacts();
      break;

    case 'get':
      importFunction.getContactById(id);
      break;

    case 'add':
      importFunction.addContact(name, email, phone);
      break;

    case 'remove':
      importFunction.removeContact(id);
      break;

    default:
      console.warn('\x1B[31m Unknown action type!');
  }
}

invokeAction(argv);