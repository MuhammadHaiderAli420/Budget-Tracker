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

- **User**: Stores account information, including full name, email and a securely hashed password using bcrypt. Additional fields include profileImageUrl, isAdmin, and timestamps.

- **Income**: Stores income records linked to users. Each record includes userId, source, amount, date, icon, and timestamps.

- **Expense**: Stores expense records linked to users. Each record includes userId, category, amount, date, notes, icon, and timestamps.

### Additional Features

- **Validation**: Enforced at the schema level for all models, including required fields, format validation, numeric constraints, and string trimming.
  
- **Relationships**: Income and Expense reference the userId using Mongoose ObjectId and ref.

- **Seeding**: A `seed.js` script is available to insert a sample user, multiple income and expense records for testing purposes.

- **ERD Diagram**: Located in `/Backend/Docs/ERD.png`, visualizing the relationships and schema design.

---

## Routes Design
The design of the API routes for the Budget Tracker Web Application, covering authentication, admin, dashboard, expense, and income functionalities are shown belwo:

- **Admin**: 
Admin routes provide privileged access for managing users and platform oversight, restricted to admin users
    + Renders the admin dashboard for system monitoring. http:localhost:{port}/api/admin/dashboard
    + Retrieves a list of all users (excluding passwords). http:localhost:{port}/api/admin/users
    + Promotes a user to admin status. http:localhost:{port}/api/admin/users/:id/make-admin
    + Deletes a user account. http:localhost:{port}/api/admin/users/:id


- **User**: 
    + Registers a new user with email and password, storing hashed credentials. http:localhost:{port}/api/auth/register
    + Authenticates a user and returns a JWT token for session management. http:localhost:{port}/api/dashboard/api/auth/login
    + Retrieves authenticated user’s profile information. http:localhost:{port}/api/auth/getUser
    + Allows users to upload profile images. http:localhost:{port}/api/auth/upload-image


- **Dashboard**: 
The dashboard route provides an overview of the user’s financial data, supporting visualization requirements. 
    +Fetches data for the user’s financial dashboard. http:localhost:{port}/api/dashboard/


- **Expense**: 
Expense routes manage user expense transactions, supporting CRUD operations and export functionality.
    + Adds a new expense entry (category, amount, date). http:localhost:{port}/api/expenses/add
    + Retrieves all expenses for the authenticated user, with optional filtering. http:localhost:{port}/api/expenses/get
    + Updates an existing expense. http:localhost:{port}/api/expenses/:id
    + Deletes an expense. http:localhost:{port}/api/expenses/:id
    + Exports expenses as an Excel file. http:localhost:{port}/api/expenses/downloadExcel


- **Income**: 
Income routes manage user income transactions, mirroring expense functionality for CRUD operations.
    + Adds a new income entry (source, amount, date). http:localhost:{port}/api/income/add
    + Retrieves all incomes for the authenticated user. http:localhost:{port}/api/income/get
    + Updates an existing income. http:localhost:{port}/api/income/:id
    + Deletes an income entry. http:localhost:{port}/api/income/:id

---

## ⚙️ Installation & Running

##  Setup Instructions


### 1. Clone the repository

```bash
git clone https://github.com/MuhammadHaiderAli420/Budget-Tracker.git
cd Budget-Tracker
```

### 2. Install necessary dependencies
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

### 4. Video for project setup

Link for sprit 1:
```
https://www.youtube.com/watch?v=sK-7vECipS4
```

Link for sprint 2:
```
https://www.youtube.com/watch?v=494Frq-Skmg
```

---


## Frontend Structure and Layout

The frontend side uses EJS for the structure, Javascript for the logic and Tailwind CSS for the styling. It is divided into the following sections:
- Auth - *login* and *signup*
- Dashboard/home - with charts, tables andquick actions
- Income
- Expenses
---
