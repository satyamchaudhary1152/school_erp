const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema({

    name: {

        type: String,

        required: true,

        trim: true

    },

    email: {

        type: String,

        required: true,

        unique: true,

        lowercase: true,

        trim: true

    },

    password: {

        type: String,

        required: true

    },

    // ===========================
    // Mobile Number
    // ===========================

    mobile: {

        type: String,

        trim: true,

        default: ""

    },

    // ===========================
    // Gender
    // ===========================

    gender: {

        type: String,

        enum: [

            "Male",

            "Female",

            "Other",

            ""

        ],

        default: ""

    },

    // ===========================
    // Role
    // ===========================

    role: {

        type: String,

        default: "Admin"

    },

    // ===========================
    // Status
    // ===========================

    status: {

        type: String,

        enum: [

            "Active",

            "Inactive"

        ],

        default: "Active"

    }

}, {

    timestamps: true

});

// ===================================
// Hash Password Before Save
// ===================================

adminSchema.pre("save", async function () {

    if (!this.isModified("password")) {

        return;

    }

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(

        this.password,

        salt

    );

});

// ===================================
// Compare Password
// ===================================

adminSchema.methods.comparePassword = async function (password) {

    return await bcrypt.compare(

        password,

        this.password

    );

};

module.exports = mongoose.model(

    "Admin",

    adminSchema

);