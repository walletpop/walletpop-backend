const jwt = require("jsonwebtoken");
const {db, User} = require ('../db');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

verifyToken = (req, res, next) => {

  let token = req.cookies.token;

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    res.cookie('userId',decoded.id);
    next();
  });
};

isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.cookies.userId);
    return user.isAdmin ? next() : res.status(403).send({
      message: "Require Admin Role!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate Admin role!",
    });
  }
};

const authJwt = {
  verifyToken,
  isAdmin
};
module.exports = authJwt;
