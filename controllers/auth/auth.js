const jwt = require("jsonwebtoken");
const User = require("../../models/user");

const verifyAuth = async (req, res, func) => {
  const auth = req.headers.authorization;

  if (!auth)
    return res.status(500).json({ message: "Authorization is required" });

  try {
    const token = auth.split(" ")?.[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ userId: decoded?.userId }).select("-_id");
    if (!user) return res.status(403).json({ message: "Invalid token" });

    req.user = user;
    func();
  } catch (e) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = verifyAuth;
