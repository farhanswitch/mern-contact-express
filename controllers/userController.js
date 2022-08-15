const userModel = require("../models/UserSchema");

const addUser = async (user) => {
  const newUser = new userModel(user);
  const savedUser = await newUser.save();
  console.log(savedUser);
  return savedUser?._id;
};

const loadUsers = async () => {
  return await userModel.find({}).sort({ name: 1 });
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
