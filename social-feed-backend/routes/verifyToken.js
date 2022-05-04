const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Access denied");

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);

    //use this below line to get the id and email ehere we are using verify
    req.user = verified;

    next();
  } catch (err) {
    res.send("Invalid Token");
  }
};
