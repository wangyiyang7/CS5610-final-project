// db.js
const { MongoClient } = require("mongodb");

const url =
  "mongodb+srv://wangyiyang7:clR7MmVoZLVz2SL1@cluster0.j4n8d.mongodb.net/";
const dbName = "Superstore";

let db;

async function connectDB() {
  const client = new MongoClient(url);
  await client.connect();
  db = client.db(dbName);
  console.log("Connected to MongoDB");
}

function getDB() {
  if (!db) {
    throw new Error("Database not connected");
  }
  return db;
}

module.exports = { connectDB, getDB };
