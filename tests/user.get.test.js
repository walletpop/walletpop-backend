const app = require("../");
const request = require("supertest");
const { User } = require("../db");
const seed = require("../db/seedFn");
var cookies = require("cookie-parser");
const { Op } = require('sequelize');

describe("users endpoint", () => {
  beforeEach(async () => {
    await seed();
  });

  describe("POST /register", () => {
    test("Successfull register", async () => {
      const { statusCode, text } = await request(app).post("/register").send({ email: "lorena@test.com", password: "test123"});

      expect(statusCode).toBe(200);
      expect(text).toBe('{"message":"User registered successfully! Please signin now!"}');
    });

    test("Error when email is already registered", async () => {
      const firstRegister = await request(app).post("/register").send({ email: "lorena@test.com", password: "test123"});
      const { statusCode, body } = await request(app).post("/register").send({ email: "lorena@test.com", password: "test123"});

      expect(statusCode).toBe(400);
      expect(body).toMatchObject({ message: "Failed! Email is already in use!"});
    });
  })

  describe("POST /signin", () => {
    test("Successfull singin", async () => {
      const firstRegister = await request(app).post("/register").send({ email: "lorena@test.com", password: "test123"});
      const {statusCode, body, headers} = await request(app).post("/signin").send({ email: "lorena@test.com", password: "test123"});

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('id', 'email', 'token');
    });

    test("Error when email is not already registered", async () => {
      const firstRegister = await request(app).post("/register").send({ email: "lorena@test.com", password: "test123"});
      const { statusCode, body } = await request(app).post("/signin").send({ email: "lorena@test.com", password: "test"});

      expect(statusCode).toBe(401);
      expect(body).toMatchObject({ message:"Invalid Password!" });
    });

    test("Error when password is wrong", async () => {
      const { statusCode, body } = await request(app).post("/signin").send({ email: "lorena@test.com", password: "test123"});

      expect(statusCode).toBe(404);
      expect(body).toMatchObject({ message:"User Not found." });
    });
  })

  describe("POST /signout", () => {
    test("Successfull signout", async () => {
      const firstRegister = await request(app).post("/register").send({ email: "lorena@test.com", password: "test123"});
      const signin = await request(app).post("/signin").send({ email: "lorena@test.com", password: "test123"});
      const {statusCode, body, headers} = await request(app).post("/signout");

      expect(statusCode).toBe(200);
      expect(body).toMatchObject({ message:"You've been signed out!" });
    });
  })

  describe("GET /user", () => {
    test("Error if user is no signin", async () => {
      const { statusCode, body } = await request(app).get("/user");

      expect(statusCode).toBe(403);
      expect(body).toMatchObject({ message:"No token provided!" });
    });

    test("Error if user is not admin", async () => {
      const firstRegister = await request(app).post("/register").send({ email: "lorena@test.com", password: "test123"});
      const {headers} = await request(app).post("/signin").send({ email: "lorena@test.com", password: "test123"});
      const { statusCode, body } = await request(app).get("/user").set('Cookie', headers['set-cookie']);

      expect(statusCode).toBe(403);
      expect(body).toMatchObject({ message:"Require Admin Role!" });
    });

    test("success if user is admin", async () => {
      const firstRegister = await request(app).post("/register").send({ email: "lorena@test.com", password: "test123", isAdmin: true});
      const {headers} = await request(app).post("/signin").send({ email: "lorena@test.com", password: "test123"});
      const { statusCode, body } = await request(app).get("/user").set('Cookie', headers['set-cookie']);

      // expect(statusCode).toBe(200);
      // expect(body).toMatchObject({ message:"Require Admin Role!" });
    });
  })

  describe("GET /user/:id", () => {
    test("Success if user is logged", async () => {
      const firstRegister = await request(app).post("/register").send({ email: "lorena@test.com", password: "test123", isAdmin: true});
      const signin = await request(app).post("/signin").send({ email: "lorena@test.com", password: "test123"});
      const { statusCode, body } = await request(app).get(`/user/${signin.body.id}`).set('Cookie', signin.headers['set-cookie']);

      console.log(body)
      expect(statusCode).toBe(200);
      expect(body).toMatchObject({ id: signin.body.id});
      expect(body).toHaveProperty('id', 'password', 'email', 'location', 'isAdmin');
    });

    test("Error if user id is not found", async () => {
      const firstRegister = await request(app).post("/register").send({ email: "lorena@test.com", password: "test123", isAdmin: true});
      const signin = await request(app).post("/signin").send({ email: "lorena@test.com", password: "test123"});
      const { statusCode, body } = await request(app).get(`/user/123`).set('Cookie', signin.headers['set-cookie']);

      console.log(body)
      expect(statusCode).toBe(400);
      expect(body).toMatchObject({ message: "Failed! User not found!"});
    });
  })
})
