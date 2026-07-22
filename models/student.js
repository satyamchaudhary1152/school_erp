const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name : {
        type : String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [3, "Minimum 3 characters required"]
    },
    email : {
        type : String,
        required : [true, "Email is required"],
        unique: true,
        lowercase : true,
        trim : true
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: [true, "Class is required"]
    },

    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
        required: [true, "Section is required"]
    },
    
    age : {
        type : Number,
        required : [true, "Age is required"],
        min: [1, "Age cannot be less than 1"],
        max: [100, "Age cannot be greater than 100"]
    }
    },{
        timestamps : true
});

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;