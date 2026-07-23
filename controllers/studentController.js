const Student = require("../models/student");
const asyncHandler = require("../middleware/asyncHandler");
const PAGE = require("../constants/pageTitles");
const Class = require("../models/class");
const Section = require("../models/section");

// GET Students ---------->>

const getAllStudents = asyncHandler(async (req, res) => {

    const search = req.query.search || "";

    const page = Number(req.query.page) || 1;

    const limit = 5;

    const skip = (page - 1) * limit;

    let query = {};

    if (search) {

        query.name = {

            $regex: search,

            $options: "i"

        };

    }

    const totalStudents = await Student.countDocuments();

    const totalResults = await Student.countDocuments(query);

    const totalPages = Math.ceil(totalResults / limit);

    const students = await Student.find(query)

        .populate("class")

        .populate("section")

        .sort({

            createdAt: -1

        })

        .skip(skip)

        .limit(limit);

    res.render("student/index", {

        title: PAGE.STUDENT.INDEX,

        students,

        search,

        page,

        totalPages,

        totalStudents,

        totalResults,

        module: "student"

    });

});

// CREATE Students ----------->>

const createStudent = asyncHandler(async(req,res)=>{

    try{

        const student = new Student(req.body);

        await student.save();

        return res.redirect("/students");

    }

    catch(error){

        const classes = await Class.find({

            status:"Active"

        });

        const sections = await Section.find({

            status:"Active"

        }).populate("class");

        let errors=[];

        if(error.name==="ValidationError"){

            errors=Object.values(error.errors).map(err=>err.message);

        }

        if(error.code===11000){

            errors.push("Email already exists.");

        }

        return res.render("student/add",{

            title:PAGE.STUDENT.ADD,

            classes,

            sections,

            errors,

            oldData:req.body,

            module:"student"

        });

    }

});

// Show ADD Form ------>>

const showAddForm = asyncHandler(async(req,res)=>{

    const classes = await Class.find({

        status:"Active"

    }).sort({

        className:1

    });

    const sections = await Section.find({

        status:"Active"

    })

    .populate("class")

    .sort({

        sectionName:1

    });

    res.render("student/add",{

        title:PAGE.STUDENT.ADD,

        classes,

        sections,

        errors:[],

        oldData:{},

        module:"student"

    });

});

//To Show EDIT Form ------>>

const showEditForm = asyncHandler(async(req,res)=>{

    const student = await Student.findById(req.params.id);

    if(!student){

        const error = new Error("Student Not Found");
        error.statusCode = 404;
        throw error;

    }

    const classes = await Class.find({
        status:"Active"
    }).sort({className:1});

    const sections = await Section.find({
        status:"Active"
    }).populate("class");

    res.render("student/edit",{

        title:PAGE.STUDENT.EDIT,

        student,

        classes,

        sections,

        errors:{},

        module:"student"

    });

});

//To UPDATE Student ------->>

const updateStudent = asyncHandler(async(req,res)=>{

    try{

        await Student.findByIdAndUpdate(

            req.params.id,

            req.body,

            {

                new:true,

                runValidators:true

            }

        );

        return res.redirect("/students");

    }

    catch(error){

        const student=req.body;

        student._id=req.params.id;

        const classes=await Class.find({status:"Active"});

        const sections=await Section.find({status:"Active"}).populate("class");

        return res.render("student/edit",{

            title:PAGE.STUDENT.EDIT,

            student,

            classes,

            sections,

            errors:error.errors || {},

            module:"student"

        });

    }

});

// DELETE Student --------->>

const deleteStudent = asyncHandler(async(req, res) => {

        const student =  await Student.findByIdAndDelete(req.params.id);

        if(!student){
            const error = Error("Student Not Found");
            error.statusCode = 404;
            throw error;
        }

        res.redirect("/students");

});

module.exports = {
    getAllStudents,
    createStudent,
    showAddForm,
    showEditForm,
    updateStudent,
    deleteStudent
};