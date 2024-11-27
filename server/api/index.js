const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const { connectDB, getDB } = require("./db");
const app = express();
const port = 5001;
const SECRET_KEY = "helloworld";

// Connect to MongoDB
connectDB().catch((err) => console.error(err));

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    res.status(200).send("Server is running...);
  } catch (e) {}
});

// Endpoint for home
app.get("/items", async (req, res) => {
  try {
    const db = await getDB();
    const collection = db.collection("products");
    console.log(collection);
    const items = await collection.find({}).toArray();
    res.status(200).json(items);
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Error fetching items" });
  }
});

// Endpoint for search
app.get("/search", async (req, res) => {
  const { query } = req.query;
  try {
    const db = await getDB();
    const collection = db.collection("products");
    const regex = new RegExp(query, "i");
    const items = await collection.find({ productName: regex }).toArray();
    res.status(200).json(items);
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Error searching items" });
  }
});

// Endpoint for item detail
app.get("/item/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getDB();
    const collection = db.collection("products");
    const item = await collection.findOne({ id: id });
    res.status(200).json(item);
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Error fetching item" });
  }
});

// Endpoint for cart
app.get("/cart", async (req, res) => {
  try {
    const db = await getDB();
    const collection = db.collection("cart");
    const items = await collection.find({}).toArray();
    res.status(200).json(items);
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Error fetching cart items" });
  }
});

// Endpoint for register
app.post("/register", async (req, res) => {
  try {
    const { password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    let user = {
      accountId: Math.floor(Math.random() * 1000).toString(),
      email: req.body.email,
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
    };

    const db = await getDB();
    const collection = await db.collection("user");
    const result = await collection.insertOne(user);
    res.status(201).send({ message: "User registered successfully!" });
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Error registering user" });
  }
});

// Endpoint for login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const db = await getDB();
    const collection = await db.collection("user");
    const user = await collection.findOne({
      email: email,
    });
    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid password!" });
    }
    const token = jwt.sign({ id: user.accountId }, SECRET_KEY, {
      expiresIn: 86400,
    });
    res.status(200).send({ tkn: token, accountId: user.accountId });
  } catch (error) {
    res.status(500).send({ message: "Error logging in" });
  }
});

// Verify JWT token
const verifyToken = (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

// Endpoint for profile
app.get("/profile/:accountId", async (req, res) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  try {
    const decoded = await verifyToken(token, SECRET_KEY);
    const { accountId } = req.params;

    if (decoded.id !== accountId) {
      return res.status(403).send({ message: "Unauthorized access!" });
    }
    const db = await getDB();
    const collection = await db.collection("user");
    const user = await collection.findOne({ accountId: accountId });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(user);
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).send({ message: "Failed to authenticate token." });
    }
    res.status(500).send({ message: "Error fetching user profile" });
  }
});

// Endpoint for place orders
app.post("/order/:accountId/:orderNumber", async (req, res) => {
  const { accountId, orderNumber } = req.params;
  const { items, total } = req.body;
  const today = new Date();
  let month = today.getMonth() + 1;
  const orderDate = today.getFullYear() + "/" + month + "/" + today.getDate();
  const orderData = {
    accountId,
    orderNumber,
    orderDate,
    total,
    items,
  };
  try {
    const db = await getDB();
    const collection = await db.collection("order");
    const orders = await collection.insertOne(orderData);
    res.status(200).send("Order received successfully");
  } catch (error) {
    console.error("Error inserting order:", error);
    res.status(500).send("Failed to place order. Please try again.");
  }
});

// Endpoint for order history
app.get("/order/:accountId", async (req, res) => {
  const { accountId } = req.params;
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  try {
    const decoded = await verifyToken(token, SECRET_KEY);
    if (decoded.id !== accountId) {
      return res.status(403).send({ message: "Unauthorized access!" });
    }
    const db = await getDB();
    const collection = await db.collection("order");
    const orders = await collection
      .find({ accountId: accountId })
      .sort({ orderNumber: -1 })
      .limit(8)
      .toArray();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send("Failed to fetch orders. Please try again.");
  }
});

// Endpoint for delete order
app.delete("/order/:orderNumber", async (req, res) => {
  const { orderNumber } = req.params;
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  try {
    const decoded = await verifyToken(token, SECRET_KEY);
    const db = await getDB();
    const collection = await db.collection("order");
    const order = await collection.findOne({ orderNumber: orderNumber });
    if (order.accountId !== decoded.id) {
      return res.status(403).send({ message: "Unauthorized access!" });
    }
    order = await collection.deleteOne({ orderNumber: orderNumber });
    res.status(200).send("Delete OK!");
  } catch (error) {
    res.status(500).send("Failed to delete order.");
  }
});

// Endpoint for profile edit
app.put("/profile/:accountId", async (req, res) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  try {
    const decoded = await verifyToken(token, SECRET_KEY);
    const { accountId } = req.params;
    const { email, firstName, lastName, address, phoneNumber } = req.body;
    if (decoded.id !== accountId) {
      return res.status(403).send({ message: "Unauthorized access!" });
    }
    const db = await getDB();
    const collection = await db.collection("user");
    const result = await collection.updateOne(
      { accountId: accountId },
      {
        $set: {
          email,
          firstName,
          lastName,
          address,
          phoneNumber,
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "User not found!" });
    }
    res.status(200).send({ message: "Profile updated successfully!" });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).send({ message: "Failed to authenticate token." });
    }
    res.status(500).send({ message: "Error updating profile" });
  }
});

// Endpoint for delete profile
app.delete("/profile/:accountId", async (req, res) => {
  const { accountId } = req.params;
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  try {
    const decoded = await verifyToken(token, SECRET_KEY);
    if (decoded.id !== accountId) {
      return res.status(403).send({ message: "Unauthorized access!" });
    }
    const db = await getDB();
    const collection = await db.collection("user");
    const result = await collection.deleteOne({ accountId: accountId });
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "User not found!" });
    }
    res.status(200).send({ message: "Account deleted successfully!" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).send({ message: "Failed to delete account" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
