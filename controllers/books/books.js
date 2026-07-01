const Book = require("../../models/book");
const BookPages = require("../../models/bookPage");
const Author = require("../../models/author");
const mongoose = require("mongoose");

const getAllBooks = async (_, res) => {
  try {
    const books = await Book.aggregate([
      {
        $lookup: {
          from: "authors",
          localField: "author",
          foreignField: "name",
          as: "author",
        },
      },
      {
        $unwind: {
          path: "$author",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          title: 1,
          author: {
            $ifNull: ["$author.name", ""],
          },
          age: {
            $ifNull: ["$author.age", null],
          },
          pages: 1,
          rank: 1,
          genre: 1,
        },
      },
    ]);
    // const books = await Book.find()
    //   .collation({ locale: "en" })
    //   .sort({ title: 1 });

    return res.json(books);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

const getBook = async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    if (!id) {
      return res.json({ message: "Invalid book" });
    }
    const book = await Book.findOne({ _id: id });
    return res.status(200).json(book);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const addBook = async (req, res) => {
  const { title, author, rank, genre, pages } = req.body || {};
  if (!title || !author || !rank || !genre.length || !pages) {
    return res.json({ message: "Fill the fields" });
  }

  const book = await Book.insertOne({
    title,
    author,
    rank,
    genre,
    pages: pages.length,
  });

  let booksPagesArr = [];

  pages.forEach((value, index) => {
    booksPagesArr.push({
      bookId: book._id,
      pageNumber: index + 1,
      imageUrl: value,
    });
  });

  await BookPages.insertMany(booksPagesArr);
  return res.status(200).json(book);
};

const updateBook = async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    if (!id) {
      return res.json({ message: "Invalid book" });
    }

    const { title, author, rank, genre, pages } = req.body || {};

    if (!title || !author || !rank || !genre.length || !pages)
      return res.status(500).json({ message: "Fill the fields" });

    const book = await Book.updateOne(
      { _id: id },
      {
        $set: {
          title,
          author,
          rank,
          genre,
          pages,
        },
      },
    );

    if (!book?.matchedCount)
      return res.status(500).json({ message: "Book not found" });

    return res.status(200).json({ message: "Success" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    if (!id) {
      return res.json({ message: "Invalid book" });
    }
    const book = await Book.deleteOne({ _id: id });

    if (!book?.deletedCount)
      return res.status(500).json({ message: "Book not found" });

    return res.status(200).json({ message: "Success" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllBooks,
  getBook,
  addBook,
  updateBook,
  deleteBook,
};
