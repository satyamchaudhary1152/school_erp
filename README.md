# School ERP Management System

## Project Overview

School ERP Management System is a web-based application developed to simplify and manage daily school operations. The system provides separate Admin and Teacher panels with role-based access and allows efficient management of students, teachers, classes, attendance, and reports.

The project is built using the MVC architecture with Node.js, Express.js, MongoDB, and EJS.

---

## Features

### Admin Panel

- Secure Admin Login
- Dashboard
- Student Management
  - Add Student
  - Edit Student
  - Delete Student
  - Search Students
- Teacher Management
  - Add Teacher
  - Edit Teacher
  - Delete Teacher
- Class Management
- Section Management
- Subject Management
- Teacher Assignment Module
- Attendance Reports
- Attendance PDF Export

### Teacher Panel

- Secure Teacher Login
- Dashboard
- View Assigned Students
- Take Attendance
- Edit Today's Attendance
- View Attendance Summary
- Update Profile
- Change Password

---

## Technology Stack

### Frontend

- HTML
- CSS
- Bootstrap 5
- EJS
- JavaScript

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Other Packages

- Express Session
- Method Override
- PDFKit
- dotenv
- bcrypt
- express-ejs-layouts

---

## Project Structure

```
student_management/

│
├── config/
├── constants/
├── controllers/
├── middleware/
├── models/
├── public/
│   ├── css/
│   ├── js/
│   └── images/
│
├── routes/
├── seed/
├── utils/
├── views/
│
├── server.js
├── package.json
└── README.md
```

---

## Installation

Clone the repository

```bash
git clone <repository-url>
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key
```

Run the application

```bash
npm start
```

or

```bash
npm run dev
```

---

## Default Login Credentials

### Admin

Email

```
admin@schoolerp.com
```

Password

```
Admin@123
```

### Teacher

Email

```
teacher@schoolerp.com
```

Password

```
Teacher@123
```

---

## Modules

- Authentication
- Dashboard
- Student Management
- Teacher Management
- Class Management
- Section Management
- Subject Management
- Teacher Assignment
- Attendance Management
- Attendance Reports
- PDF Export
- Teacher Profile

---

## Future Improvements

- Marks Management
- Result Generation
- Fee Management
- Timetable Module
- Parent Login
- Notice Board
- Homework Module
- SMS and Email Notifications
- Excel Export
- Charts and Analytics

---

## Author

Developed by

**Satyam Chaudhary**

Master of Computer Applications (MCA)

---

## License

This project is developed for educational and learning purposes.