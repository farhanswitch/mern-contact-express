const { client, usersCollection } = require("./connect-db");
const ObjectId = require("mongodb").ObjectId;

const loadAllUser = async () => {
  await client.connect();
  const result = await usersCollection.find({}).toArray();
  client.close();
  return result;
};

const findUser = async (param, value) => {
  if (value.length < 12) {
    return false;
  }
  await client.connect();
  if (param === "_id") {
    return await usersCollection.findOne({ _id: ObjectId(value) });
  }
  return await usersCollection.findOne({ [param]: value });
};

const addUser = async (name, email, password) => {
  await client.connect();
  const newUser = await usersCollection.insertOne({
    name,
    email,
    password,
    role: 3,
  });
  return newUser?.insertedId;
};
const updateUser = async (id, name, email, role) => {
  console.log(id);
  await client.connect();
  const update = await usersCollection.updateOne(
    {
      _id: ObjectId(id),
    },
    {
      $set: {
        name,
        email,
        role,
      },
    }
  );
  client.close();
  return update.modifiedCount;
};
const deleteUser = async (param, value) => {
  await client.connect();

  if (param === "_id") {
    const deletedUser = await usersCollection.deleteOne({
      [param]: ObjectId(value),
    });
    client.close();
    return deletedUser.deletedCount;
  } else {
    const deletedUser = await usersCollection.deleteOne({
      [param]: value,
    });
    client.close();
    return deletedUser.deletedCount;
  }
};
const delAllUser = async () => {
  await client.connect();
  await usersCollection.deleteMany({});
  client.close();
};

// delAllUser();
module.exports = { loadAllUser, findUser, addUser, updateUser, deleteUser };
