const { client, contactCollection } = require("./connect-db");
const ObjectId = require("mongodb").ObjectId;

const loadContacts = async () => {
  await client.connect();
  const result = await contactCollection
    .find({})
    .sort({ name: 1 })
    .collation({ locale: "en", caseLevel: false })
    .toArray();
  client.close();
  return result;
};

const findContact = async (param, value) => {
  await client.connect();
  if (param === "_id") {
    return await contactCollection.findOne({ _id: ObjectId(value) });
  }
  return await contactCollection.findOne({ [param]: value });
};

const addContact = async (contact) => {
  await client.connect();
  await contactCollection.insertOne({ ...contact });
  client.close();
};

const updateContact = async (selectedContact) => {
  const contact = await findContact("_id", selectedContact._id);
  if (JSON.stringify(contact) === JSON.stringify(selectedContact)) {
    return false;
  }
  await client.connect();
  let newContact = {};
  Object.keys(selectedContact).forEach((key) => {
    if (key !== "_id") {
      newContact[key] = selectedContact[key];
    }
  });
  const update = await contactCollection.updateOne(
    { _id: ObjectId(selectedContact._id) },
    { $set: { ...newContact } }
  );
  client.close();
  return update.modifiedCount;
};

const deleteContact = async (param, value) => {
  await client.connect();

  if (param === "_id") {
    const deletedContact = await contactCollection.deleteOne({
      [param]: ObjectId(value),
    });
    client.close();
    return deletedContact.deletedCount;
  } else {
    const deletedContact = await contactCollection.deleteOne({
      [param]: value,
    });
    client.close();
    return deletedContact.deletedCount;
  }
};

module.exports = {
  loadContacts,
  findContact,
  addContact,
  updateContact,
  deleteContact,
};
