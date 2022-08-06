const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const dbName = "contact-mf";

const db = client.db(dbName);
const usersCollection = db.collection("users");

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

const delAllUser = async () => {
  await client.connect();
  await usersCollection.deleteMany({});
  client.close();
};

// delAllUser();
module.exports = { loadAllUser, findUser, addUser };
