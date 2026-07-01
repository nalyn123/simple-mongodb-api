const Book = require("../../models/book");
const BookPages = require("../../models/bookPage");
const mongoose = require("mongoose");

const getBookPages = async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    if (!id) {
      return res.json({ message: "Invalid book" });
    }
    const book = await Book.findOne({ _id: id }).lean();
    const bookPages = await BookPages.find({ bookId: book._id })
      .sort({ pageNumber: 1 })
      .select("-_id -bookId");
    return res.status(200).json({
      ...book,
      pageSrc: bookPages,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getBookPages,
};
