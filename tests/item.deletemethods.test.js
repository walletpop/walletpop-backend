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
    expect(loginResponse.body).toHaveProperty('id', 'email', 'token');

    return loginResponse;
  }
  describe("DELETE /item", () => {
    test("Successfull deletion of item", async () => {
      const item = {name: "Hand cream" , price: 5, category: "cosmetic"};
      const user = { email: "lorena@test.com", password: "test123"}
      const signin = await registerAndLogin(user);
      const createItem = await request(app).post(`/items`).send(item).set('Cookie', signin.headers['set-cookie']);
      expect(createItem.statusCode).toBe(200);
      expect(createItem.body).toMatchObject(item)

      const {statusCode, body} = await request(app).delete(`/items/${createItem.body.id}`).set('Cookie', signin.headers['set-cookie']);
      expect(statusCode).toBe(200);
      expect(body).toMatchObject({message: "Item deleted successfully."})
    })

    test("Error if user is not logged in", async () => {
      const item = {name: "Hand cream" , price: 5, category: "cosmetic"};
      const user = { email: "lorena@test.com", password: "test123"}
      const signin = await registerAndLogin(user);
      const createItem = await request(app).post(`/items`).send(item).set('Cookie', signin.headers['set-cookie']);

      const {statusCode, body} = await request(app).delete(`/items/${createItem.body.id}`)

      expect(statusCode).toBe(403);
      expect(body).toMatchObject({ message:"No token provided!" });
    })

    test("Error if user is not the owner of the item", async () => {
      const item = {name: "Hand cream" , price: 5, category: "cosmetic"};
      const user1 = { email: "lorena@test.com", password: "test123"}
      const signinUser1 = await registerAndLogin(user1);
      const signout = await request(app).post(`/signout`);
      const user2 = { email: "ana@test.com", password: "test123"}
      const signinUser2 = await registerAndLogin(user2);

      const createItem = await request(app).post(`/items`).send(item).set('Cookie', signinUser2.headers['set-cookie']);

      const {statusCode, body} = await request(app).delete(`/items/${createItem.body.id}`).set('Cookie', signinUser1.headers['set-cookie']);

      expect(statusCode).toBe(400);
      expect(body).toMatchObject({ message:"You are not the owner of that item. You can not modify this item." });
    })
  })
})
