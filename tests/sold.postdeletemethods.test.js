const app = require("../");
const request = require("supertest");
const seed = require("../db/seedFn");

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


    describe("POST /sold/", () => {
        test("Create sold item successfully", async () => {
            createItem = await createItemFunction();

            const buyer = { email: "buyer@test.com", password: "test456"}
            const buyerSignin = await registerAndLogin(buyer);
            const {body, statusCode} = await request(app).post(`/sold/`).send({itemId: createItem.id}).set('Cookie', buyerSignin.headers['set-cookie']);

            expect(statusCode).toBe(200);
            expect(body).toHaveProperty("id");
            expect(body).toHaveProperty("dateSold");
            expect(body).toHaveProperty("buyerId");
            expect(body).toHaveProperty("itemId");

            expect(body.itemId).toBe(createItem.id);
            expect(body.buyerId).toBe(buyerSignin.body.id);
        });
    });


    describe("DELETE /sold/:id", () => {
        test("Error deletion of solditem as user is not admin", async () => {
            createItem = await createItemFunction();

            const buyer = { email: "buyer@test.com", password: "test456"}
            const buyerSignin = await registerAndLogin(buyer);
            const soldItem = await request(app).post(`/sold/`).send({itemId: createItem.id}).set('Cookie', buyerSignin.headers['set-cookie']);

            const user = { email: "user@test.com", password: "test456"}
            const userSignin = await registerAndLogin(user);
            const {body, statusCode} = await request(app).delete(`/sold/${soldItem.body.id}`).set('Cookie', userSignin.headers['set-cookie']);

            expect(statusCode).toBe(403);
            expect(body).toMatchObject({message: "Require Admin Role!"})
        })

        test("Successful deletion of solditem by admin", async () => {
            createItem = await createItemFunction();

            const buyer = { email: "buyer@test.com", password: "test456"}
            const buyerSignin = await registerAndLogin(buyer);
            const soldItem = await request(app).post(`/sold/`).send({itemId: createItem.id}).set('Cookie', buyerSignin.headers['set-cookie']);

            console.log(`/sold/${createItem.id}`)
            const user = { email: "user@test.com", password: "test456", isAdmin: true};
            const userSignin = await registerAndLogin(user);
            const {body, statusCode} = await request(app).delete(`/sold/${soldItem.body.id}`).set('Cookie', userSignin.headers['set-cookie']);

            expect(statusCode).toBe(200);
        })
    })
})
