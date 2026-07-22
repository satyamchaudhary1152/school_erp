const Teacher = require("../models/Teacher");

const createDefaultTeacher = async () => {

    try {

        // ===========================================
        // Check by Email OR Employee ID
        // ===========================================

        const teacher = await Teacher.findOne({

            $or: [

                { email: "teacher@schoolerp.com" },

                { employeeId: "TCH001" }

            ]

        });

        if (teacher) {

            console.log("Default Teacher already exists.");

            return;

        }

        // ===========================================
        // Create Default Teacher
        // ===========================================

        await Teacher.create({

            employeeId: "TCH001",

            name: "Default Teacher",

            email: "teacher@schoolerp.com",

            password: "Teacher@123",

            phone: "9876543210",

            gender: "Male",

            qualification: "MCA",

            experience: 2,

            joiningDate: new Date("2026-01-01"),

            role: "teacher",

            status: "Active",

            isActive: true

        });

        console.log("Default Teacher Created Successfully.");

    }

    catch (error) {

        console.log(error);

    }

};

module.exports = createDefaultTeacher;