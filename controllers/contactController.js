const contactModel = require("../models/contactSchema");

const loadContacts = async () => {
  return await contactModel.find({});
};
const findContact = async (param, value) => {
  return await contactModel.findOne({ [param]: value });
};
const addContact = async (contact) => {
  const newContact = new contactModel(contact);
  return await newContact.save()?.insertedId;
};
const updateContact = async (id, updateValue) => {
  return await userModel.updateOne(
    {
      _id: id,
    },
    {
      $set: { ...updateValue },
    }
  )?.modifiedCount;
};
const deleteContact = async (id) => {
  return await contactModel.deleteOne({ _id: id })?.deletedCount;
};

module.exports = {
  loadContacts,
  findContact,
  addContact,
  updateContact,
  deleteContact,
};
