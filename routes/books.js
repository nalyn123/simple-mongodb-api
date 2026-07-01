const BooksController = require("../controllers/books/books");
const BookPagesController = require("../controllers/books/pages");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  return BooksController.getAllBooks(req, res);
});

router.get("/:id", async (req, res) => {
  return BooksController.getBook(req, res);
});

router.post("/", async (req, res) => {
  return BooksController.addBook(req, res);
});

router.put("/:id", async (req, res) => {
  return BooksController.updateBook(req, res);
});

router.delete("/:id", async (req, res) => {
  return BooksController.deleteBook(req, res);
});

router.get("/pages/:id", async (req, res) => {
  return BookPagesController.getBookPages(req, res);
});

module.exports = router;
