const verifyAuth = require("../controllers/auth/auth");
const express = require("express");
const router = express.Router();
router.use(express.json());

const AuthController = require("../controllers/auth/login");

router.post("/login", (req, res) => {
  return AuthController.userLogin(req, res);
});

router.post("/logout", verifyAuth, (req, res) => {
  return AuthController.userLogout(req, res);
});

module.exports = router;
