import mongoose from "mongoose"
const studentSchema = mongoose.Schema({
    rollNum:{
        type: String, 
        required: true,
        unique: true,
    },
    name:{
        type: String, 
        required: true,
    },
    dob:{
        type: Date, 
        required: true
    },
    roomNum:{  // will be randomly assigned to student from list of available rooms-->controller logic
        type: String,
        required: true
    },
    phoneNum:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    fatherName:{
        type: String,
        required: true
    },
    motherName:{
        type: String,
        required: true
    },
    fatherEmail:{
        type: String,
        required: true
    },
    motherEmail:{
        type: String,
        required: true
    }
},{
    timestamps: true
})

export const Student = mongoose.model("Student", studentSchema);