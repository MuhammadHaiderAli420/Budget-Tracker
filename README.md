#  Personal Budget Tracker

A full-stack budget tracking application built with **Node.js**, **Express**, **MongoDB**, and **EJS**. It allows users to manage their **income and expenses**, and includes a powerful **admin panel** for managing users.

---

##  Features

###  User Features
- Register and login with JWT authentication
- Add, edit, and delete income/expense entries
- View total income, expense, and balance overview
- Responsive dashboard with transaction history
- Visualization of income/expenses distributions.

###  Admin Features
- Secure admin login with fixed credentials
- View all registered users
- Promote users to admin
- Delete users from the system

---

##  Tech Stack

- **Frontend**: EJS + Vanilla JavaScript + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT with role-based access control
- **Security**: Bcrypt password hashing, route protection middleware

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

##  Setup Instructions


### 1. Clone the repository

```bash
git clone https://github.com/MuhammadHaiderAli420/Budget-Tracker.git
cd Budget-Tracker
```

### 2. Install necessary dependencies.
```bash
cd Backend
npm install
```

### 3.Run the project
```bash
//development server
npm run dev

//production server
npm start
```
---
## Frontend Structure and Layout

The frontend side uses EJS for the structure, Javascript for the logic and Tailwind CSS for the styling. It is divided into the following sections:
- Auth - *login* and *signup*
- Dashboard/home - with charts, tables andquick actions
- Income
- Expenses
---




