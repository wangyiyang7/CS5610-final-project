const express = require("express");

const app = express();
const port = 5001;
const SECRET_KEY = "helloworld";

app.use(express.json());

app.get("/", async (req, res) => {
  try {
    res.status(200).send("Sever is running...");
  } catch (e) {}
});
