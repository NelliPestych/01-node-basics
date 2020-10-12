const fs = require("fs");
const yargs = require("yargs");
const path = require("path");

const contactsPath = path.join(__dirname, "./db/contacts.json");
// console.log(JSON.stringify(contactsPath));

// contacts.js

/*
 * Раскомментируй и запиши значение
 const contactsPath = ;
 */

// TODO: задокументировать каждую функцию
function listContacts() {
  fs.readFile("./db/contacts.json", "utf-8", (err, data) => {
    console.table(data);
  });
}

function getContactById(contactId) {
//   contactId = process.argv[2];
  fs.readFile("./db/contacts.json", function (err, data) {
    const json = JSON.parse(data);
    const contact = json.find((contact) => contact.id === Number(contactId));
    console.log(contact);
  });
}

function removeContact(contactId) {
//   contactId = process.argv[2];
  fs.readFile("./db/contacts.json", function (err, data) {
    const json = JSON.parse(data);
    json.forEach(function (el, i) {
      if (el.id == contactId) json.splice(i, 1);
    });
    fs.writeFile("./db/contacts.json", JSON.stringify(json), function (err) {
      if (err) throw err;
      console.log(json);
    });
  });
}

function addContact(name, email, phone) {
//   name = process.argv[2];
//   email = process.argv[3];
//   phone = process.argv[4];
  fs.readFile("./db/contacts.json", function (err, data) {
    const json = JSON.parse(data);
    const id = json.length + 1;
    const contact = {
      id: id,
      name: name,
      email: email,
      phone: phone,
    };
    json.push(contact);
    fs.writeFile("./db/contacts.json", JSON.stringify(json), function (err) {
      if (err) throw err;
      console.log('The "data to append" was appended to file!');
    });
  });
}

module.exports = {
    contactsPath,
    listContacts,
    getContactById,
    removeContact,
    addContact,
};
