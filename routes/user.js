const express = require("express");
const router = express.Router();
router.use(express.json());

const AuthController = require("../controllers/auth/login");

router.post("/login", (req, res) => {
  return AuthController.userLogin(req, res);
});

module.exports = router;
