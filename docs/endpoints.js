const getContacts = require("./contacts/get-contacts");
const getContactById = require("./contacts/getContactById");
const editContact = require("./contacts/edit-contact");
const addContact = require("./contacts/add-contact");
const deleteContact = require("./contacts/delete-contact");

const getUsers = require("./users/get-users");
const getUserById = require("./users/get-user-by-id");
const postUser = require("./users/post-user");
const patchUser = require("./users/patch-user");
const loginUser = require("./users/login-user");
const deleteUser = require("./users/delete-user");
const logoutUser = require("./users/logout-user");

module.exports = {
  paths: {
    "/contacts": {
      ...getContacts,
    },
    "/contacts/{id}": {
      ...getContactById,
    },
    "/contacts/add": {
      ...addContact,
    },
    "/contacts/edit/": {
      ...editContact,
    },
    "/contacts/delete/{id}": {
      ...deleteContact,
    },
    "/users": {
      ...getUsers,
    },
    "/users/{id}": {
      ...getUserById,
    },
    "/users/add": {
      ...postUser,
    },
    "/users/login": {
      ...loginUser,
    },
    "/users/edit/{id}": {
      ...patchUser,
    },
    "/users/delete/{id}": {
      ...deleteUser,
    },
    "/users/logout": {
      ...logoutUser,
    },
  },
};
