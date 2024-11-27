

const express = require('express');
const app = express();
onst jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");

app.get("/", async (req, res) => {
  try {
    res.status(200).send("Sever is running...");
  } catch (e) {}
});

app.listen(3000, () => console.log('Server ready on port 3000.'));

module.exports = app;
