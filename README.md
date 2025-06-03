#  Personal Budget Tracker

A full-stack budget tracking application built with **Node.js**, **Express**, **MongoDB**, and **EJS**. It allows users to manage their **income and expenses**, and includes a powerful **admin panel** for managing users.

---

##  Features

###  User Features
- Register and login with JWT authentication
- Add, edit, and delete income/expense entries
- Recurring Transactions  
    Users can mark income or expense entries as "Recurring". These are automatically tracked and flagged for easy identification. Options include monthly, weekly, etc. Future enhancements may include auto-generation logic.
- Pinned Transactions  
    Important or frequent transactions can be pinned for quick access and visibility at the top of lists.
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

- **User**: Stores account information, including full name, email and a securely hashed password using bcrypt. Additional fields include profileImageUrl, isAdmin, and timestamps.

- **Income**: Stores income records linked to users. Each record includes userId, source, amount, date, icon, Recurring, Recurring Type, Pinned and timestamps.

- **Expense**: Stores expense records linked to users. Each record includes userId, category, amount, date, notes, icon, Recurring, Recurring Type, Pinned and timestamps.

### Additional Features

- **Validation**: Enforced at the schema level for all models, including required fields, format validation, numeric constraints, and string trimming.
  
- **Relationships**: Income and Expense reference the userId using Mongoose ObjectId and ref.

- **Seeding**: A `seed.js` script is available to insert a sample user, multiple income and expense records for testing purposes.

- **ERD Diagram**: Located in `/Backend/Docs/ERD.png`, visualizing the relationships and schema design.

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
Testing Procedures

- Manual test cases were written to validate all operations.
- New test cases cover:
  - Recurring transaction creation, editing, and deletion.
  - Pinning/unpinning transactions and verifying their position in the UI.
- Test logs and checklists maintained in shared QA documentation.





