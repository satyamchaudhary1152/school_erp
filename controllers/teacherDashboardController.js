const asyncHandler = require("../middleware/asyncHandler");
const bcrypt = require("bcrypt");

const Teacher = require("../models/Teacher");
const TeacherAssignment = require("../models/TeacherAssignment");
const Student = require("../models/Student");
const Attendance = require("../models/Attendance");

// ======================================================
// Teacher Dashboard
// ======================================================

const showTeacherDashboard = asyncHandler(async (req, res) => {

    const teacherId = req.session.admin.id;

    const assignment = await TeacherAssignment.findOne({

        teacher: teacherId,
        status: "Active"

    })
    .populate("class")
    .populate("section");

    let totalStudents = 0;
    let todayAttendance = 0;
    let present = 0;
    let absent = 0;

    if (assignment) {

        totalStudents = await Student.countDocuments({

            class: assignment.class,
            section: assignment.section

        });

        const today = new Date();

        const start = new Date(today);
        start.setHours(0,0,0,0);

        const end = new Date(today);
        end.setHours(23,59,59,999);

        const attendance = await Attendance.findOne({

            class: assignment.class,
            section: assignment.section,

            date:{

                $gte:start,
                $lte:end

            }

        });

        if(attendance){

            todayAttendance = attendance.students.length;

            attendance.students.forEach(student=>{

                if(student.status==="Present") present++;

                if(student.status==="Absent") absent++;

            });

        }

    }

    res.render("teacher/dashboard",{

        layout:"layouts/teacherLayout",

        title:"Teacher Dashboard",

        teacher:req.session.admin,

        assignment,

        totalStudents,

        todayAttendance,

        present,

        absent,

        module:"teacher"

    });

});


// ======================================================
// My Profile
// ======================================================

const showTeacherProfile = asyncHandler(async(req,res)=>{

    const teacher = await Teacher.findById(req.session.admin.id);

    res.render("teacher/profile/profile",{

        layout:"layouts/teacherLayout",

        title:"My Profile",

        teacher,

        module:"teacher"

    });

});


// ======================================================
// Edit Profile
// ======================================================

const showEditTeacherProfile = asyncHandler(async(req,res)=>{

    const teacher = await Teacher.findById(req.session.admin.id);

    res.render("teacher/profile/edit",{

        layout:"layouts/teacherLayout",

        title:"Edit Profile",

        teacher,

        errors:[],

        module:"teacher"

    });

});


// ======================================================
// Update Profile
// ======================================================

const updateTeacherProfile = asyncHandler(async(req,res)=>{

    try{

        const teacher = await Teacher.findById(req.session.admin.id);

        if(!teacher){

            return res.redirect("/teacher/profile");

        }

        // Duplicate Email Check

        const existingTeacher = await Teacher.findOne({

            email:req.body.email.toLowerCase(),

            _id:{$ne:teacher._id}

        });

        if(existingTeacher){

            return res.render("teacher/profile/edit",{

                layout:"layouts/teacherLayout",

                title:"Edit Profile",

                teacher:req.body,

                errors:["Email already exists."],

                module:"teacher"

            });

        }

        teacher.name=req.body.name;
        teacher.email=req.body.email.toLowerCase();
        teacher.phone=req.body.phone;
        teacher.gender=req.body.gender;
        teacher.qualification=req.body.qualification;
        teacher.experience=req.body.experience;
        teacher.joiningDate=req.body.joiningDate;

        await teacher.save();

        // ============================
        // Update Session
        // ============================

        req.session.admin.name=teacher.name;
        req.session.admin.email=teacher.email;

        return res.redirect("/teacher/profile");

    }

    catch(error){

        const teacher=await Teacher.findById(req.session.admin.id);

        res.render("teacher/profile/edit",{

            layout:"layouts/teacherLayout",

            title:"Edit Profile",

            teacher,

            errors:[error.message],

            module:"teacher"

        });

    }

});


// =====================================
// Change Password Page
// =====================================

const showTeacherChangePassword = asyncHandler(async (req, res) => {

    const teacher = await Teacher.findById(

        req.session.admin.id

    );

    res.render(

        "teacher/profile/changePassword",

        {

            layout: "layouts/teacherLayout",

            title: "Change Password",

            teacher,

            error: null,

            success: null,

            module: "teacher"

        }

    );

});

// =====================================
// Update Password
// =====================================

const updateTeacherPassword = asyncHandler(async (req, res) => {

    const {

        currentPassword,

        newPassword,

        confirmPassword

    } = req.body;

    const teacher = await Teacher.findById(

        req.session.admin.id

    );

    // Current Password Check

    const isMatch = await teacher.comparePassword(

        currentPassword

    );

    if (!isMatch) {

        return res.render(

            "teacher/profile/changePassword",

            {

                layout: "layouts/teacherLayout",

                title: "Change Password",

                teacher,

                error: "Current Password is incorrect.",

                success: null,

                module: "teacher"

            }

        );

    }

    // Confirm Password Check

    if (newPassword !== confirmPassword) {

        return res.render(

            "teacher/profile/changePassword",

            {

                layout: "layouts/teacherLayout",

                title: "Change Password",

                teacher,

                error: "New Password and Confirm Password do not match.",

                success: null,

                module: "teacher"

            }

        );

    }

    // Save New Password
    // NOTE:
    // Teacher model ka pre("save") middleware khud password hash karega.

    teacher.password = newPassword;

    await teacher.save();

    // Logout after password change

    req.session.destroy((err) => {

        if (err) {

            return res.redirect(

                "/teacher/change-password"

            );

        }

        res.clearCookie("connect.sid");

        return res.redirect("/login/teacher");

    });

});


// ======================================================

module.exports = {

    // Dashboard
    showTeacherDashboard,

    // Profile
    showTeacherProfile,

    showEditTeacherProfile,

    updateTeacherProfile,

    // Change Password
    showTeacherChangePassword,

    updateTeacherPassword

};