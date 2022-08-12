const userModel = require("../models/UserSchema");

const addUser = async (user) => {
  const newUser = new userModel(user);
  const savedUser = await newUser.save();
  console.log(savedUser);
  return savedUser?.insertedId;
};

const loadUsers = async () => {
  return await userModel.find({});
};
const findUser = async (param, value) => {
  return await userModel.findOne({ [param]: value });
};
const updateUser = async (id, updateValue) => {
  const update = await userModel.updateOne(
    {
      _id: id,
    },
    {
      $set: { ...updateValue },
    }
  );

  return update.modifiedCount;
};

const deleteUser = async (id) => {
  const deletedUser = await userModel.deleteOne({ _id: id });
  return deletedUser.deletedCount;
};

module.exports = { addUser, loadUsers, updateUser, deleteUser, findUser };
