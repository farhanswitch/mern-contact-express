const mongoose = require("mongoose");

const dbName = "contact-mf";

const mongodb = `mongodb://127.0.0.1:27017/${dbName}`;

mongoose.connect(mongodb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.on("open", () => {
  console.log("Connection successful");
});

module.exports = db;

// const { MongoClient } = require("mongodb");

// const url = "mongodb://localhost:27017";
// const client = new MongoClient(url);
// const dbName = "contact-mf";

// const db = client.db(dbName);
// const contactCollection = db.collection("contact");
// const usersCollection = db.collection("users");

// module.exports = { client, contactCollection, usersCollection };
