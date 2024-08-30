const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config");
async function authMiddleware(req, res, next) {
  let authorizationHeader = req.headers.authorization;
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.status(403).json({ msg: "invalid authorization header " });
  }
  const sentToken = authorizationHeader.slice(7, authorizationHeader.length);
  try {
    const decoded = await jwt.verify(sentToken, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.log("an error occured : " + err);
    res.status(411).json({ msg: "an error occured" });
  }
}

module.exports = {
  authMiddleware,
};
