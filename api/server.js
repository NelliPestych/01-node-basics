const express = require("express");
// const cors = require('cors');
const mongoose = require("mongoose");
const ContactRouter = require("../contacts/contact.routers");
require("dotenv").config();

module.exports = class ContactServer {
  constructor() {
    this.server = null;
  }

  async start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    await this.initDatabase();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    this.server.use(express.json());
  }

  initRoutes() {
    this.server.use("/contacts", ContactRouter);
  }

  async initDatabase() {
    await mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });
  }

  startListening() {
    this.server.listen(process.env.PORT, () => {
      console.log("SERVER STARTED LISTENING ON PORT", process.env.PORT);
    });
  }
};
