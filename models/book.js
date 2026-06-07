const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
    },
    pages: {
      type: Number,
      default: 0,
    },
    rank: {
      type: Number,
      default: 0,
    },
    genre: {
      type: Array,
      default: [],
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model("Book", BookSchema);
