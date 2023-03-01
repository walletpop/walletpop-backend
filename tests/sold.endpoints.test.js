const app = require("../");
const request = require("supertest");
const { User } = require("../db");
const seed = require("../db/seedFn");
var cookies = require("cookie-parser");

describe("sold items endpoints", () => {
    beforeEach(async () => {
        await seed();
        });

    async function registerAndLogin() {
        const registerResponse = await request(app).post("/register").send({ email: "test@mail.com", password: "testpassword"});
        expect(registerResponse.statusCode).toBe(200);

        const loginResponse = await request(app).post("/signin").send({ email: "test@mail.com", password: "testpassword"});
        expect(loginResponse.statusCode).toBe(200);
        expect(loginResponse.body).toHaveProperty('id', 'email', 'token');

        return loginResponse;
    }

    describe("GET /sold", () => {
        test("Return all sold items", async () => {
            const signin = await registerAndLogin();
            const {statusCode, body} = await request(app)
            .get("/sold")
            .set("Cookie", signin.headers["set-cookie"]);

            expect(statusCode).toBe(200);
            expect(Array.isArray(body)).toBe(true);
            body.forEach((item) => {
                expect(item).toHaveProperty("id");
                expect(item).toHaveProperty("dateSold");
                expect(item).toHaveProperty("itemId");
                expect(item).toHaveProperty("buyerId");
            });
        });

        test("Return error if user is not admin", async () => {
            const signin = await registerAndLogin();
            const { statusCode, body } = await request(app)
            .get("/sold")
            .set("Cookie", signin.headers["set-cookie"]);

            expect(statusCode).toBe(403);
            expect(body).toMatchObject({ message: "Require Admin Role!"});
        });

        test("Return error if admin role can't be confirmed", async () => {
            const signin = await registerAndLogin();
            const { statusCode, body } = await request(app)
            .get("/sold")
            .set("Cookie", signin.headers["set-cookie"]);

            expect(statusCode).toBe(500);
            expect(body).toMatchObject({ message: "Unable to validate Admin role!"});
        });
    })

    describe("GET /sold/user/:user_id", () => {
        test("Return a user's sold items", async () => {
            const signin = await registerAndLogin();
            const {statusCode, body} = await request(app)
            .get(`/sold/user/${buyer_id}`)
            .set("Cookie", signin.headers["set-cookie"]);

            expect(statusCode).toBe(200);
            expect(Array.isArray(body)).toBe(true);
            body.forEach((item) => {
                expect(item).toHaveProperty("id");
                expect(item).toHaveProperty("dateSold");
                expect(item).toHaveProperty("itemId");
                expect(item).toHaveProperty("buyerId");
            });
        });

        test("Return error if correct user is not logged in", async () => {
            const signin = await registerAndLogin();
            const { statusCode, body } = await request(app)
            .get("/sold")
            .set("Cookie", signin.headers["set-cookie"]);

            expect(statusCode).toBe(401);
            expect(body).toMatchObject({ message: "Unauthorized!"});
        });

        test("Return error if user is not admin", async () => {
            const signin = await registerAndLogin();
            const { statusCode, body } = await request(app)
            .get("/sold")
            .set("Cookie", signin.headers["set-cookie"]);

            expect(statusCode).toBe(403);
            expect(body).toMatchObject({ message: "Require Admin Role!"});
        });

        test("Return error if admin role can't be confirmed", async () => {
            const signin = await registerAndLogin();
            const { statusCode, body } = await request(app)
            .get("/sold")
            .set("Cookie", signin.headers["set-cookie"]);

            expect(statusCode).toBe(500);
            expect(body).toMatchObject({ message: "Unable to validate Admin role!"});
        });
    });

    describe("PUT /sold/:id", () => {
        test("Edit sold item successfully", async () => {
            const signin = await registerAndLogin();
            const newSoldItem = {dateSold: "2023-03-01 12:05:53.387 +00:00", itemId: "024de92b-654e-45c6-bfcc-16fa9c60d436", buyerId: "0abeaa59-c2d0-4099-9afb-9c46ac49689a"};

            const createSoldItem = await request(app)
            .post("/sold")
            .send(newSoldItem)
            .set("Cookie", signin.headers["set-cookie"]);
            expect(createSoldItem.statusCode).toBe(200);
            expect(createSoldItem.body).toMatchObject(newSoldItem);

            const editedSoldItem = {dateSold: "2023-03-01 12:10:53.387 +00:00", buyerId: "689ae427-232c-4f55-9a30-dca77d79579b"};
            const {statusCode, body} = await request(app)
            .put(`/sold/${createSoldItem.body.id}`)
            .send(editedSoldItem)
            .set("Cookie", signin.headers["set-cookie"]);
            expect(statusCode).toBe(200);
            expect(body).toMatchObject(editedSoldItem);
        });

        test("Return error if user is not admin", async () => {
            const signin = await registerAndLogin();
            const { statusCode, body } = await request(app)
            .get("/sold")
            .set("Cookie", signin.headers["set-cookie"]);

            expect(statusCode).toBe(403);
            expect(body).toMatchObject({ message: "Require Admin Role!"});
        });

        test("Return error if admin role can't be confirmed", async () => {
            const signin = await registerAndLogin();
            const { statusCode, body } = await request(app)
            .get("/sold")
            .set("Cookie", signin.headers["set-cookie"]);

            expect(statusCode).toBe(500);
            expect(body).toMatchObject({ message: "Unable to validate Admin role!"});
        });
    });

    describe("DELETE /sold/:id", () => {
        test("Delete sold item successfully", async () => {
            const signin = await registerAndLogin();
            const newSoldItem = {dateSold: "2023-03-01 12:05:53.387 +00:00", itemId: "024de92b-654e-45c6-bfcc-16fa9c60d436", buyerId: "0abeaa59-c2d0-4099-9afb-9c46ac49689a"};

            const createSoldItem = await request(app)
            .post("/sold")
            .send(newSoldItem)
            .set("Cookie", signin.headers["set-cookie"]);
            expect(createSoldItem.statusCode).toBe(200);
            expect(createSoldItem.body).toMatchObject(newSoldItem);

            const {statusCode, body} = await request(app)
            .delete(`/sold/${createSoldItem.body.id}`)
            .set("Cookie", signin.headers["set-cookie"]);
            expect(statusCode).toBe(200);
            expect(body).toMatchObject("Sold item deleted successfully!");
        });

        test("Return error if user is not admin", async () => {
            const signin = await registerAndLogin();
            const { statusCode, body } = await request(app)
            .get("/sold")
            .set("Cookie", signin.headers["set-cookie"]);

            expect(statusCode).toBe(403);
            expect(body).toMatchObject({ message: "Require Admin Role!"});
        });

        test("Return error if admin role can't be confirmed", async () => {
            const signin = await registerAndLogin();
            const { statusCode, body } = await request(app)
            .get("/sold")
            .set("Cookie", signin.headers["set-cookie"]);

            expect(statusCode).toBe(500);
            expect(body).toMatchObject({ message: "Unable to validate Admin role!"});
        });
    });

    describe("POST /sold", () => {
        test("Create new sold item successfully", async () => {
            const signin = await registerAndLogin();
            const newSoldItem = {dateSold: "2023-03-01 12:05:53.387 +00:00", itemId: "024de92b-654e-45c6-bfcc-16fa9c60d436", buyerId: "0abeaa59-c2d0-4099-9afb-9c46ac49689a"};

            const {statusCode, body} = await request(app)
            .post("/sold")
            .send(newSoldItem)
            .set("Cookie", signin.headers["set-cookie"]);
            expect(statusCode).toBe(200);
            expect(body).toMatchObject(newSoldItem);
        });

        test("Return error if dateSold is not provided", async () => {
            const signin = await registerAndLogin();
            const newSoldItem = {itemId: "024de92b-654e-45c6-bfcc-16fa9c60d436", buyerId: "0abeaa59-c2d0-4099-9afb-9c46ac49689a"};

            const {statusCode, body} = await request(app)
            .post("/sold")
            .send(newSoldItem)
            .set("Cookie", signin.headers["set-cookie"]);
            expect(statusCode).toBe(200);
            expect(body).toMatchObject({message:"notNull Violation: newSoldItem.dateSold cannot be null"});
        });

        test("Return error if itemId is not provided", async () => {
            const signin = await registerAndLogin();
            const newSoldItem = {dateSold: "2023-03-01 12:05:53.387 +00:00", buyerId: "0abeaa59-c2d0-4099-9afb-9c46ac49689a"};

            const {statusCode, body} = await request(app)
            .post("/sold")
            .send(newSoldItem)
            .set("Cookie", signin.headers["set-cookie"]);
            expect(statusCode).toBe(200);
            expect(body).toMatchObject({message:"notNull Violation: newSoldItem.itemId cannot be null"});
        });

        test("Return error if buyerId is not provided", async () => {
            const signin = await registerAndLogin();
            const newSoldItem = {dateSold: "2023-03-01 12:05:53.387 +00:00", itemId: "024de92b-654e-45c6-bfcc-16fa9c60d436"};

            const {statusCode, body} = await request(app)
            .post("/sold")
            .send(newSoldItem)
            .set("Cookie", signin.headers["set-cookie"]);
            expect(statusCode).toBe(200);
            expect(body).toMatchObject({message:"notNull Violation: newSoldItem.buyerId cannot be null"});
        });

        test("Return error if user is not admin", async () => {
            const signin = await registerAndLogin();
            const { statusCode, body } = await request(app)
            .get("/sold")
            .set("Cookie", signin.headers["set-cookie"]);

            expect(statusCode).toBe(403);
            expect(body).toMatchObject({ message: "Require Admin Role!"});
        });

        test("Return error if admin role can't be confirmed", async () => {
            const signin = await registerAndLogin();
            const { statusCode, body } = await request(app)
            .get("/sold")
            .set("Cookie", signin.headers["set-cookie"]);

            expect(statusCode).toBe(500);
            expect(body).toMatchObject({ message: "Unable to validate Admin role!"});
        });
    });
})
