const app = require("../");
const request = require("supertest");
const seed = require("../db/seedFn");
const { SoldItem } = require("../db");

describe("sold items endpoints", () => {
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

    async function createItemFunction(){
        const seller = { email: "seller@test.com", password: "test123"}
        const sellerSignin = await registerAndLogin(seller);
        const item = {name: "Hand cream" , price: 5, category: "cosmetic"};
        const createItem = await request(app).post(`/items`).send(item).set('Cookie', sellerSignin.headers['set-cookie']);
        const sellerSignOut = await request(app).post("/signout");

        return createItem.body;
    }


    describe("GET /sold/", () => {
        test("If the user is admin return all sold items", async () => {

            const admin = { email: "admin@test.com", password: "test456", isAdmin: true}
            const adminSignin = await registerAndLogin(admin);
            const {body, statusCode} = await request(app).get(`/sold/`).set('Cookie', adminSignin.headers['set-cookie']);

            expect(statusCode).toBe(200);
            expect(Array.isArray(body)).toBe(true);
            body.forEach((element) => {
                expect(element).toHaveProperty("id");
                expect(element).toHaveProperty("dateSold");
                expect(element).toHaveProperty("buyerId");
                expect(element).toHaveProperty("itemId");
            })
            expect(body.length).toBe(3);
        });

        test("If the user is not admin return only their sold items", async () => {
            createItem = await createItemFunction();

            const buyer = { email: "buyer@test.com", password: "test456"}
            const buyerSignin = await registerAndLogin(buyer);
            const soldItem = await request(app).post(`/sold/`).send({itemId: createItem.id}).set('Cookie', buyerSignin.headers['set-cookie']);

            const {body, statusCode} = await request(app).get(`/sold/`).set('Cookie', buyerSignin.headers['set-cookie']);

            expect(statusCode).toBe(200);
            expect(Array.isArray(body)).toBe(true);
            body.forEach((element) => {
                expect(element).toHaveProperty("id");
                expect(element).toHaveProperty("dateSold");
                expect(element).toHaveProperty("buyerId");
                expect(element).toHaveProperty("itemId");
            })

            expect(body[0].buyerId).toBe(buyerSignin.body.id);
            expect(body[0].itemId).toBe(createItem.id);
            expect(body.length).toBe(1);
        });
    });


    describe("GET /sold/:id", () => {
        test("If the user is admin return the item", async () => {

            const soldItem = await SoldItem.findOne();

            const admin = { email: "admin@test.com", password: "test456", isAdmin: true}
            const adminSignin = await registerAndLogin(admin);
            const {body, statusCode} = await request(app).get(`/sold/${soldItem.id}`).set('Cookie', adminSignin.headers['set-cookie']);

            expect(statusCode).toBe(200);
            expect(body).toHaveProperty("id");
            expect(body).toHaveProperty("dateSold");
            expect(body).toHaveProperty("buyerId");
            expect(body).toHaveProperty("itemId");

            expect(body.buyerId).toBe(soldItem.buyerId);
            expect(body.itemId).toBe(soldItem.itemId);

        });

        test("If the user buy that item sucessfully return the item", async () => {
            createItem = await createItemFunction();

            const buyer = { email: "buyer@test.com", password: "test456"}
            const buyerSignin = await registerAndLogin(buyer);
            const soldItem = await request(app).post(`/sold/`).send({itemId: createItem.id}).set('Cookie', buyerSignin.headers['set-cookie']);

            const {body, statusCode} = await request(app).get(`/sold/${soldItem.body.id}`).set('Cookie', buyerSignin.headers['set-cookie']);

            expect(statusCode).toBe(200);
            expect(body).toHaveProperty("id");
            expect(body).toHaveProperty("dateSold");
            expect(body).toHaveProperty("buyerId");
            expect(body).toHaveProperty("itemId");

            expect(body.buyerId).toBe(soldItem.body.buyerId);
            expect(body.itemId).toBe(soldItem.body.itemId);
        });

        test("If the user buy that item sucessfully return the item", async () => {
            createItem = await createItemFunction();

            const buyer = { email: "buyer@test.com", password: "test456"}
            const buyerSignin = await registerAndLogin(buyer);
            const soldItem = await request(app).post(`/sold/`).send({itemId: createItem.id}).set('Cookie', buyerSignin.headers['set-cookie']);
            const buyerSignOut = await request(app).post("/signout");

            const user = { email: "user@test.com", password: "test666"}
            const userSignin = await registerAndLogin(user);

            const {body, statusCode} = await request(app).get(`/sold/${soldItem.body.id}`).set('Cookie', userSignin.headers['set-cookie']);

            expect(statusCode).toBe(401);
            expect(body).toMatchObject({ message:"Unauthorized!" });
        });
    });
})
