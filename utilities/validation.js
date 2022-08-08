const bcrypt = require("bcrypt");
const validator = require("validator");

const { findUser } = require("./manage-users");
const { findContact } = require("./manage-contacts");

const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

const checkEmail = (email) => {
  if (!email) return false;
  return validator.isEmail(email);
};

const checkPassword = (password) => {
  if (!password) {
    return false;
  }
  if (password.length < 8) {
    return false;
  } else {
    return true;
  }
};

const checkName = (name) => {
  if (!name) {
    return false;
  }
  return validator.isAlpha(name, "en-US", { ignore: " " });
};

const validatingUserData = async (name, email, password) => {
  const isValidName = checkName(name);
  const isValidEmail = checkEmail(email);
  const isValidPassword = checkPassword(password);
  const duplicateEmail = await findUser("email", email);

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

const checkDuplication = async (param, value, id) => {
  const duplicate = await findContact(param, value);
  console.log(param, value);

  if (duplicate?._id.toString() === id) {
    return false;
  }
  if (duplicate) {
    return true;
  } else {
    return false;
  }
};
const validatingContact = async (contact) => {
  const { name, email, phone } = contact;
  const id = contact._id || null;

  const isValidEmail = validator.isEmail(email);
  const isValidPhone = validator.isMobilePhone(phone, "id-ID");

  console.log(email);
  let isDuplicateName = false;
  let isDuplicateEmail = false;
  let isDuplicatePhone = false;
  // if (id !== null) {
  isDuplicateName = await checkDuplication("name", name, id);
  isDuplicateEmail = await checkDuplication("email", email, id);
  console.log(isDuplicateEmail);
  isDuplicatePhone = await checkDuplication("phone", phone, id);
  // }
  const possibleErrors = {
    "Email is not Valid": !isValidEmail,
    "Phone is not Valid": !isValidPhone,
    "Duplicate name": isDuplicateName,
    "Duplicate email": isDuplicateEmail,
    "Duplicate phone": isDuplicatePhone,
  };
  const errors = [];
  Object.keys(possibleErrors).forEach((key) => {
    if (possibleErrors[key] === true) {
      errors.push(key);
    }
  });
  return errors;
};

module.exports = { comparePassword, validatingUserData, validatingContact };
