const bcrypt = require("bcrypt");

const {
  validatingEditUser,
  validatingUserData,
  comparePassword,
} = require("../utilities/validation");
const { findUser } = require("../controllers/userController");
const { decrypt } = require("../utilities/aes");
const { generateJWT } = require("../utilities/manage-jwt");

const MidEditUser = async (req, res, next) => {
  if (req.userData.role !== 1) {
    res.status(403).json({
      statusMsg: "Error",
      msg: "Forbidden",
    });
  } else {
    const { _id, name, email, role } = req.body;
    if (!_id || !name || !email || !role) {
      res.json({
        statusMsg: "Error",
        errors: [{ msg: "Data is not complete" }],
      });
    } else {
      const errors = await validatingEditUser(_id, name, email, role);
      if (errors.length !== 0) {
        res.json({
          statusMsg: "Error",
          errors,
        });
      } else {
        req.editUser = { _id, name, email, role };
        next();
      }
    }
  }
};

const MidLoadUsers = (req, res, next) => {
  if (req.userData.role !== 1) {
    res.status(403).json({
      statusMsg: "Error",
      msg: "Forbidden",
    });
  } else {
    next();
  }
};

const MidAddUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  const decryptedPassword = decrypt(password);
  const errors = await validatingUserData(name, email, decryptedPassword);
  if (errors.length !== 0) {
    res.json({
      statusMsg: "Error",
      errors,
    });
  } else {
    const hashedPassword = await bcrypt.hash(decryptedPassword, 10);
    req.addUser = { name, email, hashedPassword };
    next();
  }
};

const MidDeleteUser = async (req, res, next) => {
  if (req.userData.role !== 1) {
    res.status(403).json({
      statusMsg: "Error",
      msg: "Forbidden",
    });
  } else {
    next();
  }
};
const MidLoginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const existingUser = await findUser("email", email);
  if (!existingUser) {
    res.json({
      statusMsg: "Error",
      errors: [{ msg: `There is no account with email ${email}` }],
    });
  } else {
    const isValidPassword = await comparePassword(
      decrypt(password),
      existingUser?.password
    );
    if (!isValidPassword) {
      res.json({
        statusMsg: "Error",
        errors: [{ msg: "Wrong password" }],
      });
    } else {
      console.log(existingUser._id);
      console.log(existingUser.role);
      const jwtToken = generateJWT(
        existingUser._id.toString(),
        existingUser.role
      );
      req.JWTLogin = jwtToken;
      next();
    }
  }
};

module.exports = {
  MidEditUser,
  MidLoadUsers,
  MidAddUser,
  MidDeleteUser,
  MidLoginUser,
};
