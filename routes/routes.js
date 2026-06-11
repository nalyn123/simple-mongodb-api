const { rateLimit, ipKeyGenerator } = require("express-rate-limit");
const express = require("express");
const router = express.Router();
const userRoute = require("./user");
const bookRoute = require("./books");
const verifyAuth = require("../controllers/auth/auth");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 200,
  message: "Too many request",
  legacyHeaders: false,
  keyGenerator: async (req) => {
    const auth = req.headers.authorization;

    if (auth) {
      try {
        const token = auth.split(" ")?.[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded) {
          const user = await User.findOne({ userId: decoded?.userId }).select(
            "-_id",
          );

          if (user) {
            return user.userId;
          }
        }
      } catch (err) {}
    }

    return ipKeyGenerator(req.ip);
  },
});

router.use("/", limiter);
router.use("/", userRoute);
router.use("/books", verifyAuth, bookRoute);

module.exports = router;
