const jwt = require("jsonwebtoken");
const {db, User} = require ('../db');

const JWT_SECRET = process.env.JWT_SECRET;

verifyToken = (req, res, next) => {

  let token = req.headers.authorization;

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  } else {
    token = token.split(" ")[1];
  }

  console.log(token);

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);

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
