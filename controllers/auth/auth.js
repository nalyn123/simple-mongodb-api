const jwt = require("jsonwebtoken");

const verifyAuth = (req, res, func) => {
  const auth = req.headers.authorization;

  if (!auth)
    return res.status(500).json({ message: "Authorization is required" });

  try {
    const token = auth.split(" ")?.[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    func();
  } catch (e) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = verifyAuth;
