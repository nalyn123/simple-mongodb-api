const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    loginAttempt: {
      type: Number,
      default: 0,
    },
    firstLoginAttempt: {
      type: Date,
    },
    lockUntil: {
      type: Date,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model("User", User);
