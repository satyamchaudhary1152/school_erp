const Admin = require("../models/Admin");

const createDefaultAdmin = async () => {

    try {

        const admin = await Admin.findOne({

            email: "admin@schoolerp.com"

        });

        if (admin) {

            console.log("Default Admin already exists.");

            return;

        }

        await Admin.create({

            name: "Administrator",

            email: "admin@schoolerp.com",

            password: "Admin@123",

            mobile: "9876543210",

            gender: "Male"

        });

        console.log("Default Admin Created Successfully.");

    }

    catch (error) {

        console.log(error);

    }

};

module.exports = createDefaultAdmin;