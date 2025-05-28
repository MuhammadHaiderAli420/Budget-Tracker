const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require("jsonwebtoken");
const app = require("../server"); 
const Expense = require("../models/Expense");
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

describe("Expense API", () => {
    let token;
    let userId;

    beforeEach(async () => {
        // Create a test user and generate JWT token
        const user = await User.create({ email: "test@example.com", password: "password" });
        userId = user._id;
        token = jwt.sign({ id: userId }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
    });

    afterEach(async () => {
        await Expense.deleteMany({});
        await User.deleteMany({});
    });

    describe("POST /api/expenses/add", () => {
        it("should add a new expense with valid data", async () => {
            const res = await request(app)
                .post("/api/expenses/add")
                .set("Authorization", `Bearer ${token}`)
                .send({ category: "Food", amount: 50, date: "2023-01-01" });

            expect(res.statusCode).toBe(201);
            expect(res.body.category).toBe("Food");
            expect(res.body.amount).toBe(50);

            const expenseInDb = await Expense.findOne({ userId });
            expect(expenseInDb).not.toBeNull();
        });

        it("should return 400 if required fields are missing", async () => {
            const res = await request(app)
                .post("/api/expenses/add")
                .set("Authorization", `Bearer ${token}`)
                .send({ category: "Food" }); // Missing amount and date

            expect(res.statusCode).toBe(400);
            expect(res.body.errors).toBeDefined();
        });

        it("should return 401 if not authenticated", async () => {
            const res = await request(app)
                .post("/api/expenses/add")
                .send({ category: "Food", amount: 50, date: "2023-01-01" });

            expect(res.statusCode).toBe(401);
        });
    });

    describe("GET /api/expenses/get", () => {
        it("should retrieve expenses for authenticated user", async () => {
            await Expense.create([
                { userId, category: "Food", amount: 50, date: "2023-01-01" },
                { userId, category: "Travel", amount: 100, date: "2023-01-02" },
            ]);

            const res = await request(app)
                .get("/api/expenses/get?page=1&limit=5")
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.expenses.length).toBe(2);
            expect(res.body.totalPages).toBe(1);
            expect(res.body.currentPage).toBe(1);
            expect(res.body.totalExpenses).toBe(2);
        });

        it("should filter expenses by category", async () => {
            await Expense.create([
                { userId, category: "Food", amount: 50, date: "2023-01-01" },
                { userId, category: "Travel", amount: 100, date: "2023-01-02" },
            ]);

            const res = await request(app)
                .get("/api/expenses/get?category=Food")
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.expenses.length).toBe(1);
            expect(res.body.expenses[0].category).toBe("Food");
        });

        it("should return 401 if not authenticated", async () => {
            const res = await request(app).get("/api/expenses/get");
            expect(res.statusCode).toBe(401);
        });
    });

    describe("PUT /api/expenses/:id", () => {
        it("should update an existing expense", async () => {
            const expense = await Expense.create({
                userId,
                category: "Food",
                amount: 50,
                date: "2023-01-01",
            });

            const res = await request(app)
                .put(`/api/expenses/${expense._id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ category: "Groceries", amount: 75 });

            expect(res.statusCode).toBe(200);
            expect(res.body.category).toBe("Groceries");
            expect(res.body.amount).toBe(75);
        });

        it("should return 404 if expense not found", async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app)
                .put(`/api/expenses/${fakeId}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ category: "Groceries" });

            expect(res.statusCode).toBe(404);
        });

        it("should return 401 if not authenticated", async () => {
            const expense = await Expense.create({
                userId,
                category: "Food",
                amount: 50,
                date: "2023-01-01",
            });

            const res = await request(app)
                .put(`/api/expenses/${expense._id}`)
                .send({ category: "Groceries" });

            expect(res.statusCode).toBe(401);
        });
    });

    describe("DELETE /api/expenses/:id", () => {
        it("should delete an existing expense", async () => {
            const expense = await Expense.create({
                userId,
                category: "Food",
                amount: 50,
                date: "2023-01-01",
            });

            const res = await request(app)
                .delete(`/api/expenses/${expense._id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBeDefined();

            const expenseInDb = await Expense.findById(expense._id);
            expect(expenseInDb).toBeNull();
        });

        it("should return 404 if expense not found", async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app)
                .delete(`/api/expenses/${fakeId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(404);
        });

        it("should return 401 if not authenticated", async () => {
            const expense = await Expense.create({
                userId,
                category: "Food",
                amount: 50,
                date: "2023-01-01",
            });

            const res = await request(app).delete(`/api/expenses/${expense._id}`);
            expect(res.statusCode).toBe(401);
        });
    });

    describe("GET /api/expenses/downloadExcel", () => {
        it("should download expenses as Excel file", async () => {
            await Expense.create([
                { userId, category: "Food", amount: 50, date: "2023-01-01" },
                { userId, category: "Travel", amount: 100, date: "2023-01-02" },
            ]);

            const res = await request(app)
                .get("/api/expenses/downloadExcel")
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.headers["content-type"]).toMatch(/application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet/);
            expect(res.headers["content-disposition"]).toMatch(/attachment; filename=expenses\.xlsx/);
        });

        it("should return 401 if not authenticated", async () => {
            const res = await request(app).get("/api/expenses/downloadExcel");
            expect(res.statusCode).toBe(401);
        });
    });
});