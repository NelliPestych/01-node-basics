const express = require("express");
const { promises: fsPromises } = require('fs');
const multer = require("multer");
const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");
const fs = require("fs");
const Avatar = require("avatar-builder");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "tmp");
  },
  filename: function (req, file, cb) {
    let ext = "";
    if (file.originalname.split(".").length > 1)
      ext = file.originalname.substring(
        file.originalname.lastIndexOf("."),
        file.originalname.length
      );
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage: storage });


app.post(
  "/form-data",
  upload.single("avatar"),
  minifyImage,
);

async function minifyImage(req, res, next) {
  try {
    await imagemin(["tmp/*.{jpg,png}"], {
      destination: "public/images",
      plugins: [
        imageminJpegtran(),
        imageminPngquant(),
      ],
    });
    next();
  } catch (err) {
    next(err);
  }
}

const catAvatar = Avatar.catBuilder(256);
async function Avatar(name) {
  return await catAvatar.create(name).then((buffer) =>
    fs.writeFile(`tmp/${name}.png`, buffer, (err) => {
      if (err) throw err;
    })
  );
}

async function removeAvatar(file) {
  return await fs.unlink(`tmp/${file}`, (err) => {
    if (err) throw err;
  });
}

module.exports = {
  Avatar,
  removeAvatar,
  minifyImage,
  upload,
};
