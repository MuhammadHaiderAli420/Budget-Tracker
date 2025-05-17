Personal Budget Tracker is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) application that allows users to register, log in, and manage their personal finances. Users can add, edit, and delete income and expense transactions, set monthly budgets, and view their financial summaries through charts. The backend server (Node.js + Express) connects to MongoDB Atlas, handles user authentication with JWT, and provides secure API routes. The frontend (React.js) offers a mobile-responsive UI for easy budget tracking. To run the project locally, set up the backend by creating a .env file with your MongoDB URI and JWT secret, then run npm run dev. For the frontend, navigate to the frontend folder, run npm install, and npm start to launch it on http://localhost:3000. The project is collaboratively developed by the team and is structured for scalability and future feature expansion.
BUDGET-TRACKER/
├─ Backend/ # API server
│ ├─ server.js # Main entry point
│ ├─ package.json
│ ├─ .env # MONGO_URI, SESSION_SECRET, PORT
│ ├─ config/ # Database & Passport config
│ ├─ controllers/ # Request handlers (auth, tx, budget)
│ ├─ middleware/ # Auth guards
│ ├─ models/ # Mongoose schemas (User, Transaction, Budget)
│ └─ routes/ # Express routes (/api/auth, /api/tx, /api/bud)
└─ frontend/ # Static UI
├─ index.html # Landing page
├─ signup.html
├─ login.html
├─ transactions.html
├─ budgets.html
└─ js/ # Fetch-based API client & page scripts
├─ api.js
├─ signup.js
├─ login.js
├─ transactions.js
└─ budgets.js

---

## 🚀 Features

- **User Auth**  
  Sign-up, log-in & log-out via Passport.js + express-session  
- **Transactions**  
  Create, read, update & delete income/expenses  
- **Budgets**  
  Set and list spending limits per category  
- **Vanilla JS Frontend**  
  Static pages styled with Materialize CSS calling your API  
- **REST API**  
  `/api/auth`, `/api/tx`, `/api/bud` with JSON requests/responses

---

## 🛠 Tech Stack

- **Backend**: Node.js, Express, MongoDB Atlas or local, Mongoose, Passport-Local, express-session, dotenv  
- **Frontend**: HTML, Materialize CSS, Vanilla JavaScript (Fetch API)  

---

## 🗄️ Database Design

The backend uses MongoDB with Mongoose to manage persistent data. The following collections are implemented:

- **User**: Stores account information, including name, email (with format validation and uniqueness), and a securely hashed password using bcrypt.

- **Transaction**: Logs income and expense records linked to users. It includes validation for transaction type (`Income` or `Expense`), category, amount, and date. 

- **Budget**: Tracks budget limits per user and category. Validates categories against a defined list and enforces one budget per category per user via a compound index.

### Additional Features

- **Validation**: Enforced at the schema level for all models (e.g., required fields, format validation, numeric constraints, enums).
  
- **Relationships**: Both transactions and budgets reference the user `_id` using Mongoose `ObjectId` and `ref`.

- **Seeding**: A `seed.js` script is available to insert a sample user, multiple budgets, and transactions for testing purposes.

- **ERD Diagram**: Located in `/Backend/Docs/ERD.jpeg`, visualizing the relationships and schema design.

---

## ⚙️ Installation & Running

### 1. Clone & install

```bash
git clone https://github.com/MuhammadHaiderAli420/Budget-Tracker.git
cd Budget-Tracker/Backend
npm install
test change
