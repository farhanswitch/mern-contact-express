const userModel = require("../models/UserSchema");

const addUser = async (user) => {
  const newUser = new userModel(user);
  return await newUser.save()?.insertedId;
};

const loadUsers = async () => {
  return await userModel.find({}).toArray();
};
const findUser = async (param, value) => {
  return await userModel.findOne({ [param]: value });
};
const updateUser = async (id, updateValue) => {
  return await userModel.updateOne(
    {
      _id: id,
    },
    {
      $set: { ...updateValue },
    }
  )?.modifiedCount;
};

const deleteUser = async (id) => {
  return await userModel.deleteOne({ _id: id })?.deletedCount;
};

module.exports = { addUser, loadUsers, updateUser, deleteUser, findUser };
