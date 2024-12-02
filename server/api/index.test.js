const request = require("supertest");
const app = require("./index");
const { MongoClient } = require("mongodb");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

jest.mock("mongodb");
jest.mock("jsonwebtoken");
jest.mock("bcryptjs");

describe("API Endpoints", () => {
  let client;
  let db;
  let collection;

  beforeAll(() => {
    client = {
      connect: jest.fn(),
      db: jest.fn().mockReturnThis(),
      collection: jest.fn().mockReturnThis(),
      find: jest.fn().mockReturnThis(),
      findOne: jest.fn(),
      insertOne: jest.fn(),
      updateOne: jest.fn(),
      deleteOne: jest.fn(),
      toArray: jest.fn(),
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
    };
    MongoClient.mockImplementation(() => client);
    db = client.db();
    collection = db.collection();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET / should return server running message", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe("CS5610 Fall2024 Group6 Sever is running...");
  });

  test("GET /items should return items", async () => {
    const items = [{ id: 1, name: "item1" }];
    collection.toArray.mockResolvedValue(items);

    const res = await request(app).get("/items");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(items);
  });

  test("GET /item/:id should return item detail", async () => {
    const item = { id: 1, name: "item1" };
    collection.findOne.mockResolvedValue(item);

    const res = await request(app).get("/item/1");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(item);
  });

  test("GET /search should return search results", async () => {
    const items = [{ id: 1, name: "item1" }];
    collection.toArray.mockResolvedValue(items);

    const res = await request(app).get("/search").query({ query: "item" });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(items);
  });

  test("GET /cart should return cart items", async () => {
    const items = [{ id: 1, name: "item1" }];
    collection.toArray.mockResolvedValue(items);

    const res = await request(app).get("/cart");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(items);
  });

  test("POST /register should register a user", async () => {
    const user = { email: "test@example.com", password: "password" };
    const hashedPassword = "hashedPassword";
    bcrypt.hashSync.mockReturnValue(hashedPassword);
    collection.insertOne.mockResolvedValue({ insertedId: 1 });

    const res = await request(app).post("/register").send(user);
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe("User registered successfully!");
  });

  test("POST /login should login a user", async () => {
    const user = { email: "test@example.com", password: "password" };
    const dbUser = { email: "test@example.com", password: "hashedPassword", accountId: "123" };
    collection.findOne.mockResolvedValue(dbUser);
    bcrypt.compareSync.mockReturnValue(true);
    jwt.sign.mockReturnValue("token");

    const res = await request(app).post("/login").send(user);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ tkn: "token", accountId: "123" });
  });

  test("POST /order/:accountId/:orderNumber should place an order", async () => {
    const order = { items: [{ id: 1, name: "item1" }], total: 100 };
    collection.insertOne.mockResolvedValue({ insertedId: 1 });

    const res = await request(app).post("/order/123/1").send(order);
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe("Order received successfully");
  });
});
