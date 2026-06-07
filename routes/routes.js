const express = require("express");
const router = express.Router();
const userRoute = require("./user");
const bookRoute = require("./books");
const verifyAuth = require("../controllers/auth/auth");

router.use("/", userRoute);
router.use("/books", verifyAuth, bookRoute);

module.exports = router;
