const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const schema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "can't be blank"],
      index: true,
      minlength: 3
    },
    profile_photo: { type: String, default: null },
    hash: { type: String, required: true },
    status: { type: Boolean, default: false },
    language: { type: String, default: "en", maxlength: 2 },
    fcm: { type: String, default: null },
    about: { type: String, default: "Available", maxlength: 15 },
    email: {
      type: String,
      unique: true,
      required: [true, "can't be blank"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address"
      ],
      index: true
    },
    salt: String,
    refresh_token: String
  },
  { timestamps: true }
);

schema.methods.setPassword = function(password) {
  if (password.length < 5) {
    throw new Error(
      `password: '${password}' is shorter than the minimum allowed length 5`
    );
  }
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};

schema.methods.validPassword = function(password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.hash === hash;
};

schema.methods.generateJWT = function() {
  return jwt.sign(
    {
      id: this._id,
      username: this.username
    },
    process.env.API_SECRET,
    { expiresIn: "1m" }
  );
};

schema.methods.generateRefreshToken = function() {
  this.refresh_token = crypto.randomBytes(16).toString("hex");
  return { refresh_token: this.refresh_token };
};

schema.methods.validRefreshToken = function(refreshSalt) {
  return this.refreshSalt === refreshSalt;
};

schema.plugin(uniqueValidator, { message: "is already taken." });

schema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", schema);
