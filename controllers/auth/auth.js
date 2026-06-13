const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const BlacklistToken = require("../../models/blacklistToken");

const verifyAuth = async (req, res, func) => {
  const auth = req.headers.authorization;

  if (!auth)
    return res.status(401).json({ message: "Authorization is required" });

  try {
    const token = auth.split(" ")?.[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const isBlacklist = await BlacklistToken.findOne({
      token,
    });

    if (isBlacklist) {
      return res.status(401).json({ message: "Authorization is required" });
    }

    const user = await User.findOne({ userId: decoded?.userId }).select("-_id");
    if (!user) return res.status(403).json({ message: "Invalid token" });

    req.user = user;
    func();
  } catch (e) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = verifyAuth;
