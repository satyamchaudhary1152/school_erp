require("dotenv").config();

const express = require("express");
const app = express();

const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Routes
const dashboardRoutes = require("./routes/dashboardRoutes");
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const classRoutes = require("./routes/classRoutes");
const sectionRoutes = require("./routes/sectionRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const teacherAssignmentRoutes = require("./routes/teacherAssignmentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const createDefaultAdmin = require("./seed/adminSeeder");
const authRoutes = require("./routes/authRoutes");
const session = require("express-session");
const teacherDashboardRoutes = require("./routes/teacherDashboardRoutes");
const teacherStudentRoutes = require("./routes/teacherStudentRoutes");
const teacherAttendanceRoutes = require("./routes/teacherAttendanceRoutes");
const teacherProfileRoutes = require("./routes/teacherProfileRoutes");
const createDefaultTeacher = require("./seed/teacherSeeder");

const {

    adminMiddleware,

    teacherMiddleware

} = require("./middleware/authMiddleware");

// ===========================
// Express Config
// ===========================

app.set("view engine", "ejs");
app.set("views", "./views");
app.set("layout", "layouts/adminLayout");

app.use(expressLayouts);
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(
    session({
        secret: process.env.SESSION_SECRET || "schoolerpsecret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24
        }
    })
);

// ===========================
// Global Admin Session
// ===========================

app.use((req,res,next)=>{

    res.locals.admin = req.session.admin || null;

    res.locals.userRole = req.session.admin?.role || null;

    next();

});


// ===========================
// Routes
// ===========================

app.get("/", (req, res) => {
    res.render("landing", {
        layout: false
    });
});

app.use("/dashboard", adminMiddleware, dashboardRoutes);

app.use("/students", adminMiddleware, studentRoutes);

app.use("/teachers", adminMiddleware, teacherRoutes);

app.use("/classes", adminMiddleware, classRoutes);

app.use("/sections", adminMiddleware, sectionRoutes);

app.use("/subjects", adminMiddleware, subjectRoutes);

app.use("/teacher-assignments", adminMiddleware, teacherAssignmentRoutes);

app.use("/attendance", adminMiddleware, attendanceRoutes);

app.use("/", authRoutes);

app.use(

    "/teacher",

    teacherMiddleware,

    teacherDashboardRoutes

);

app.use(

    "/teacher",

    teacherMiddleware,

    teacherStudentRoutes

);

app.use(

    "/teacher",

    teacherMiddleware,

    teacherAttendanceRoutes

);

// ===========================
// Error Handler
// ===========================

app.use(errorHandler);

// ===========================

const PORT = process.env.PORT;

const startServer = async () => {

    // Connect MongoDB
    await connectDB();

    // Create Default Admin
    await createDefaultAdmin();

    // Create Default Teacher
    await createDefaultTeacher();

    // Start Server
    app.listen(PORT, () => {

        console.log(`App is listening on port ${PORT}`);

    });

};

startServer();