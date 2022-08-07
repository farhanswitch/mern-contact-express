const bcrypt = require("bcrypt");
const validator = require("validator");

const { findUser } = require("./manage-users");

const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

const checkEmail = (email) => validator.isEmail(email);

const checkPassword = (password) => {
  if (password.length < 8) {
    return false;
  } else {
    return true;
  }
};

const checkName = (name) => validator.isAlpha(name, "en-US", { ignore: " " });

const validatingUserData = (name, email, password) => {
  const isValidName = name ? checkName(name) : true;
  const isValidEmail = checkEmail(email);
  const isValidPassword = checkPassword(password);
  const duplicateEmail = findUser("email", email);

  const possibleError = {
    "Name only contains letters and spaces": !isValidName,
    "Email is not valid": !isValidEmail,
    "Email already registered": duplicateEmail ? true : false,
    "Password min 8 characters": !isValidPassword,
  };
  let errors = [];
  Object.keys(possibleError).forEach((key) => {
    if (possibleError[key] === true) {
      errors.push({ msg: key });
    }
  });
  return errors;
};
module.exports = { comparePassword, validatingUserData };
