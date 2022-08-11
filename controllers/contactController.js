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
  const updatedContact = await contactModel.updateOne(
    {
      _id: id,
    },
    {
      $set: { ...updateValue },
    }
  );
  return updatedContact?.modifiedCount;
};
const deleteContact = async (id) => {
  const deletedContact = await contactModel.deleteOne({ _id: id });
  return deletedContact?.deletedCount;
};

module.exports = {
  loadContacts,
  findContact,
  addContact,
  updateContact,
  deleteContact,
};
