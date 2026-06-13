const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../../models/user");
const BlacklistToken = require("../../models/blacklistToken");
const jwt = require("jsonwebtoken");

const hashPassword = async (password) => {
  const salt = 10;
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

const verifyPassword = async (password, currentPassword) => {
  const isVerified = await bcrypt.compare(password, currentPassword);
  return isVerified;
};

const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password)
      return res
        .status(500)
        .json({ message: "Username or password is required" });

    const user = await User.findOne({ username });
    if (!user) return res.status(500).json({ message: "User not found" });

    const isVerified = await verifyPassword(password, user.password);
    if (!isVerified)
      return res.status(500).json({ message: "Invalid Password" });

    const token = jwt.sign(
      {
        userId: user.userId,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      },
    );
    return res.json({ token });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const userLogout = async (req, res) => {
  try {
    const auth = req.headers.authorization;

    if (!auth)
      return res.status(401).json({ message: "Authorization is required" });

    const token = auth.split(" ")?.[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await BlacklistToken.insertOne({
      token,
      expiredAt: new Date(decoded.exp * 1000),
    });

    res.status(200).json({ message: "Success" });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

module.exports = {
  userLogin,
  userLogout,
};
