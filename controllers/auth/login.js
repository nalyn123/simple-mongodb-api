const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../../models/user");
const BlacklistToken = require("../../models/blacklistToken");
const jwt = require("jsonwebtoken");

const MAX_ATTEMPTS = 5;
const ATTEMPT_WINDOW = 60 * 60 * 1000; // 1 hour
const LOCK_ATTEMPTS_UNTIL = 60 * 1000; //1 minute

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

    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(429).json({
        message: "Too many login attempts. Please wait 1 minute to try again.",
      });
    }

    const isPasswordMatched = await verifyPassword(password, user.password);
    if (!isPasswordMatched) {
      let userUpdateAttempt = {};
      let now = Date.now();

      if (
        !user.firstLoginAttempt ||
        now - user.firstLoginAttempt.getTime() > ATTEMPT_WINDOW
      ) {
        userUpdateAttempt.loginAttempt = 1;
        userUpdateAttempt.firstLoginAttempt = new Date(now);
      } else {
        userUpdateAttempt.loginAttempt = (user.loginAttempt ?? 0) + 1;
      }

      if (user?.loginAttempt >= MAX_ATTEMPTS) {
        userUpdateAttempt.loginAttempt = 0;
        userUpdateAttempt.lockUntil = new Date(
          Date.now() + LOCK_ATTEMPTS_UNTIL,
        );
      }

      await User.updateOne({ _id: user._id }, userUpdateAttempt);
      return res.status(500).json({ message: "Invalid Password" });
    }

    const token = jwt.sign(
      {
        userId: user.userId,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      },
    );
    await User.updateOne(
      { _id: user._id },
      {
        loginAttempt: 0,
        lockUntil: null,
        firstLoginAttempt: null,
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
