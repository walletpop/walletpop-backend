const app = require("..");
const request = require("supertest");
const { Item } = require("../db");
const seed = require("../db/seedFn");

describe("item endpoints", () => {
  beforeEach(async () => {
    await seed();
  });

  async function registerAndLogin(body) {
    const registerResponse = await request(app).post("/register").send(body);
    expect(registerResponse.statusCode).toBe(200);

    const loginResponse = await request(app).post("/signin").send(body);
    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body).toHaveProperty("id", "email", "token");

    return loginResponse;
  }

  describe("GET /item", () => {
    test("Successfull return all items", async () => {
      const user = { email: "lorena@test.com", password: "test123" };
      const signin = await registerAndLogin(user);
      const { statusCode, body } = await request(app)
        .get("/item")
        .set("Cookie", signin.headers["set-cookie"]);

      expect(statusCode).toBe(200);
      expect(Array.isArray(body)).toBe(true);
      body.forEach((element) => {
        expect(element).toHaveProperty("id");
        expect(element).toHaveProperty("name");
        expect(element).toHaveProperty("description");
        expect(element).toHaveProperty("price");
        expect(element).toHaveProperty("isAvailable");
        expect(element).toHaveProperty("category");
      });
    });

    test("Error returning item data if user hasn't logged in", async () => {
      const user = { email: "lorena@test.com", password: "test123" };
      const signin = await registerAndLogin(user);
      const { statusCode, body } = await request(app).get("/item");

      expect(statusCode).toBe(403);
      expect(body).toMatchObject({ message: "No token provided!" });
    });

    test("Error if token is wrong", async () => {
      const user = { email: "lorena@test.com", password: "test123" };
      const signin = await registerAndLogin(user);
      const { statusCode, body } = await request(app)
        .get("/item")
        .set("Cookie", ["token=123", "userId=123"]);

      expect(statusCode).toBe(401);
      expect(body).toMatchObject({ message: "Unauthorized!" });
    });
  });

  describe("GET /item/:id", () => {
    test("Successfull return all items", async () => {
      const user = { email: "lorena@test.com", password: "test123" };
      const signin = await registerAndLogin(user);
      const item = await Item.findOne();
      const { statusCode, body } = await request(app)
        .get(`/item/${item.id}`)
        .set("Cookie", signin.headers["set-cookie"]);

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("id");
      expect(body).toHaveProperty("name");
      expect(body).toHaveProperty("description");
      expect(body).toHaveProperty("price");
      expect(body).toHaveProperty("isAvailable");
      expect(body).toHaveProperty("category");
    });
  });

  describe("GET /user/:user_id", () => {
    test("Successfull return all items", async () => {
      const user = { email: "lorena@test.com", password: "test123" };
      const signin = await registerAndLogin(user);
      const { statusCode, body } = await request(app)
        .get(`/item/user/${signin.body.id}`)
        .set("Cookie", signin.headers["set-cookie"]);

      expect(statusCode).toBe(200);
      expect(Array.isArray(body)).toBe(true);
      body.forEach((element) => {
        expect(element).toHaveProperty("id");
        expect(element).toHaveProperty("name");
        expect(element).toHaveProperty("description");
        expect(element).toHaveProperty("price");
        expect(element).toHaveProperty("isAvailable");
        expect(element).toHaveProperty("category");
      });
    });
  });

  describe("GET /item/filter", () => {
    test("Successfull return all items", async () => {
      const user = { email: "lorena@test.com", password: "test123" };
      const signin = await registerAndLogin(user);
      const query = "?category=home";
      const { statusCode, body } = await request(app)
        .get(`/item/items/filter${query}`)
        .set("Cookie", signin.headers["set-cookie"]);

      expect(statusCode).toBe(200);
      expect(Array.isArray(body)).toBe(true);
      body.forEach((element) => {
        expect(element).toHaveProperty("id");
        expect(element).toHaveProperty("name");
        expect(element).toHaveProperty("description");
        expect(element).toHaveProperty("price");
        expect(element).toHaveProperty("isAvailable");
        expect(element).toHaveProperty("category");
      });
    });

  });
});
