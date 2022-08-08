const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const dbName = "contact-mf";

const db = client.db(dbName);
const contactCollection = db.collection("contact");
const usersCollection = db.collection("users");

module.exports = { client, contactCollection, usersCollection };
