require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateJWT = (id) => {
  return jwt.sign(
    {
      id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "10m",
    }
  );
};

const verifyJWT = (req, res, next) => {
  const token = req?.cookies?.fstoken;
  if (!token) {
    res.json({
      statusMsg: "Error",
      errors: [{ msg: "You have no access id. Please Login" }],
    });
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, result) => {
      if (err) {
        res.json({
          statusMsg: "Error",
          errors: [{ msg: "Invalid access id" }],
        });
      } else {
        // console.log(result);
        req.userData = result;
        req.userId = result.id;
        next();
      }
    });
  }
};

module.exports = { generateJWT, verifyJWT };
