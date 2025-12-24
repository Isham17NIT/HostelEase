import mongoose from "mongoose"

const leaveSchema = mongoose.Schema({
    studentID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    fromDate:{
        type: Date,
        required: true
    },
    toDate:{
        type: Date,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    purpose:{
        type: String,
        required: true
    },
    status:{
        type: String,
        enum: ["APPROVED", "PENDING", "REJECTED"],
        default: "PENDING"
    }
}, {timestamps: true})

export const Leave = mongoose.model("Leave", leaveSchema)