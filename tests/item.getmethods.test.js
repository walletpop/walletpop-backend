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

  describe("GET /items", () => {
    test("Successfull return all items", async () => {
      const { statusCode, body } = await request(app)
        .get("/items")

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

  describe("GET /items/:id", () => {
    test("Successfull return all items", async () => {
      const item = await Item.findOne();
      console.log(item.id);
      const { statusCode, body } = await request(app)
        .get(`/items/${item.id}`)

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
    test("Successfull return all user items", async () => {
      const user = { email: "lorena@test.com", password: "test123" };
      const signin = await registerAndLogin(user);
      const { statusCode, body } = await request(app)
        .get(`/items/user/${signin.body.id}`)
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

  describe("GET /items/filter", () => {
    test("Successfull return all items by filter", async () => {
      const query = "?category=home";
      const { statusCode, body } = await request(app)
        .get(`/items/filter${query}`)

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
