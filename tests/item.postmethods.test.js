const app = require("../");
const request = require("supertest");
const { User, Item } = require("../db");
const seed = require("../db/seedFn");
var cookies = require("cookie-parser");
const { Op } = require('sequelize');

describe("item endpoints", () => {
  beforeEach(async () => {
    await seed();
  });

  async function registerAndLogin(body) {
    const registerResponse = await request(app).post("/register").send(body);
    expect(registerResponse.statusCode).toBe(200);

    const loginResponse = await request(app).post("/signin").send(body);
    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body).toHaveProperty('id', 'email', 'token');

    return loginResponse;
  }

  describe("POST /item", () => {
    test("Successfull return all items", async () => {
      const item = {name: "Hand cream" , price: 5, category: "cosmetic"};
      const user = { email: "lorena@test.com", password: "test123"}
      const signin = await registerAndLogin(user);
      const { statusCode, body } = await request(app).post(`/item`).send(item).set('Cookie', signin.headers['set-cookie']);

      expect(statusCode).toBe(200);
      expect(body).toMatchObject(item)
    })

    test("Error if price is not set", async () => {
      const item = {name: "Hand cream"};
      const user = { email: "lorena@test.com", password: "test123"}
      const signin = await registerAndLogin(user);
      const { statusCode, body } = await request(app).post(`/item`).send(item).set('Cookie', signin.headers['set-cookie']);

      expect(statusCode).toBe(500);
      expect(body).toMatchObject({ message:"notNull Violation: item.price cannot be null" })
    })

    test("Error if name is not set", async () => {
      const item = {price: 4};
      const user = { email: "lorena@test.com", password: "test123"}
      const signin = await registerAndLogin(user);
      const { statusCode, body } = await request(app).post(`/item`).send(item).set('Cookie', signin.headers['set-cookie']);

      expect(statusCode).toBe(500);
      expect(body).toMatchObject({ message:"notNull Violation: item.name cannot be null" })
    })

    test("Error if user is not logged in", async () => {
      const item = {name: "hand cream", price: 4};
      const user = { email: "lorena@test.com", password: "test123"}
      const signin = await registerAndLogin(user);
      const { statusCode, body } = await request(app).post(`/item`).send(item);

      expect(statusCode).toBe(403);
      expect(body).toMatchObject({ message:"No token provided!" });
    })
  })
})
