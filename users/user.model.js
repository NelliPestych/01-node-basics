const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: String,
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
  },
  token: { type: String, required: false },
});

userSchema.statics.findUserByIdAndUpdate = findUserByIdAndUpdate;
userSchema.statics.findUserByEmail = findUserByEmail;
userSchema.statics.updateToken = updateToken;
async function findUserByIdAndUpdate(id, updateParams) {
  return this.findByIdAndUpdate(
    id,
    {
      $set: updateParams,
    },
    {
      new: true,
    }
  );
}

async function findUserByEmail(email) {
  return this.findOne({ email });
}
async function updateToken(id, newToken) {
  return this.findByIdAndUpdate(id, {
    token: newToken,
  });
}

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
