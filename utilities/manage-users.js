const { client, usersCollection } = require("./connect-db");
const ObjectId = require("mongodb").ObjectId;

const loadAllUser = async () => {
  await client.connect();
  const result = await usersCollection.find({}).toArray();
  client.close();
  return result;
};

const findUser = async (param, value) => {
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
  });
  return newUser?.insertedId;
};
const updateUser = async (name, email, role) => {
  await client.connect();
  const update = await usersCollection.updateOne(
    {
      email,
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
const delAllUser = async () => {
  await client.connect();
  await usersCollection.deleteMany({});
  client.close();
};

// delAllUser();
module.exports = { loadAllUser, findUser, addUser, updateUser };
