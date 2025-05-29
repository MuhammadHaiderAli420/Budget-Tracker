const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require("jsonwebtoken");
const app = require("../server");
const Income = require("../models/Income");
const User = require("../models/User");

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe("Income API", () => {
    let token;
    let userId;

    beforeEach(async () => {
        // Create a test user and generate JWT token
        const user = await User.create({ email: "test@example.com", password: "password" });
        userId = user._id;
        token = jwt.sign({ id: userId }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
    });

    afterEach(async () => {
        await Income.deleteMany({});
        await User.deleteMany({});
    });

    describe("POST /api/income/add", () => {
        it("should add a new income with valid data", async () => {
            const res = await request(app)
                .post("/api/income/add")
                .set("Authorization", `Bearer ${token}`)
                .send({ source: "Salary", amount: 5000, date: "2023-01-01" });

            expect(res.statusCode).toBe(201);
            expect(res.body.source).toBe("Salary");
            expect(res.body.amount).toBe(5000);
            expect(res.body.userId).toBe(userId.toString());

            const incomeInDb = await Income.findOne({ userId });
            expect(incomeInDb).not.toBeNull();
        });

        it("should return 400 if required fields are missing", async () => {
            const res = await request(app)
                .post("/api/income/add")
                .set("Authorization", `Bearer ${token}`)
                .send({ source: "Salary" }); // Missing amount and date

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe("Missing required fields");
        });

        it("should return 401 if not authenticated", async () => {
            const res = await request(app)
                .post("/api/income/add")
                .send({ source: "Salary", amount: 5000, date: "2023-01-01" });

            expect(res.statusCode).toBe(401);
        });
    });

    describe("GET /api/income/get", () => {
        it("should retrieve all incomes for authenticated user", async () => {
            await Income.create([
                { userId, source: "Salary", amount: 5000, date: "2023-01-01" },
                { userId, source: "Bonus", amount: 1000, date: "2023-01-02" },
            ]);

            const res = await request(app)
                .get("/api/income/get")
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body[0].source).toBe("Bonus"); // Sorted by date descending
            expect(res.body[1].source).toBe("Salary");
        });

        it("should return 401 if not authenticated", async () => {
            const res = await request(app).get("/api/income/get");
            expect(res.statusCode).toBe(401);
        });
    });

    describe("PUT /api/income/:id", () => {
        it("should update an existing income", async () => {
            const income = await Income.create({
                userId,
                source: "Salary",
                amount: 5000,
                date: "2023-01-01",
            });

            const res = await request(app)
                .put(`/api/income/${income._id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ source: "Updated Salary", amount: 5500 });

            expect(res.statusCode).toBe(200);
            expect(res.body.source).toBe("Updated Salary");
            expect(res.body.amount).toBe(5500);
        });

        it("should return null if income not found or unauthorized", async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app)
                .put(`/api/income/${fakeId}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ source: "Updated Salary" });

            expect(res.statusCode).toBe(200);
            expect(res.body).toBeNull();
        });

        it("should return 401 if not authenticated", async () => {
            const income = await Income.create({
                userId,
                source: "Salary",
                amount: 5000,
                date: "2023-01-01",
            });

            const res = await request(app)
                .put(`/api/income/${income._id}`)
                .send({ source: "Updated Salary" });

            expect(res.statusCode).toBe(401);
        });
    });

    describe("DELETE /api/income/:id", () => {
        it("should delete an existing income", async () => {
            const income = await Income.create({
                userId,
                source: "Salary",
                amount: 5000,
                date: "2023-01-01",
            });

            const res = await request(app)
                .delete(`/api/income/${income._id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.source).toBe("Salary");

            const incomeInDb = await Income.findById(income._id);
            expect(incomeInDb).toBeNull();
        });

        it("should return null if income not found or unauthorized", async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app)
                .delete(`/api/income/${fakeId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toBeNull();
        });

        it("should return 401 if not authenticated", async () => {
            const income = await Income.create({
                userId,
                source: "Salary",
                amount: 5000,
                date: "2023-01-01",
            });

            const res = await request(app).delete(`/api/income/${income._id}`);
            expect(res.statusCode).toBe(401);
        });
    });
});