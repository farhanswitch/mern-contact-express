require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateJWT = (id, role) => {
  return jwt.sign(
    {
      id,
      role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "50m",
    }
  );
};
// console.log(generateJWT("62ecd7b5687013a04024a4c7", 1));
// console.log(generateJWT("62f2099dee1781449955b66c", 2));
// console.log(generateJWT("62ecc34f589b61a1600f3762", 3));
const verifyJWT = (req, res, next) => {
  const token = req?.cookies?.fstoken;
  // console.log(req);
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
        console.log(result);
        req.userData = result;
        req.userId = result.id;
        next();
      }
    });
  }
};

module.exports = { generateJWT, verifyJWT };
