const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const teacherSchema = new mongoose.Schema({

    employeeId: {
        type: String,
        unique: true,
        required: true
    },       

    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [3, "Minimum 3 characters required"]
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        defaule: "teacher"
    },

    phone: {
        type: String,
        required: [true, "Phone Number is required"],
        unique: true,
        trim: true,
        minlength: [10, "Phone number must be 10 digits"],
        maxlength: [10, "Phone number must be 10 digits"]
    },

    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: [true, "Gender is required"]
    },

    qualification: {
        type: String,
        required: [true, "Qualification is required"],
        trim: true
    },

    experience: {
        type: Number,
        required: [true, "Experience is required"],
        min: [0, "Experience cannot be negative"]
    },

    joiningDate: {
        type: Date,
        required: [true, "Joining Date is required"]
    },

    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    },

    isActive: {
        type: Boolean,
        default: true
    },

    lastLogin: {
        type: Date,
        default: null
    }

}, {
    timestamps: true
});

teacherSchema.pre("save", async function () {

    if (!this.isModified("password")) {

        return;

    }

    this.password = await bcrypt.hash(this.password, 10);

});

teacherSchema.methods.comparePassword = async function (password) {

    return bcrypt.compare(password, this.password);

};

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;