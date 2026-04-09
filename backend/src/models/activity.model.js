import mongoose from "mongoose"
const activitySchema = new mongoose.Schema({
    type:{
        type: String,
        enum: [
            "LEAVE_APPROVED",
            "LEAVE_REJECTED",
            "STUDENT_ADDED",
            "REBATE_APPROVED",
            "REBATE_REJECTED",
            "COMPLAINT_RESOLVED",
            "STUDENT_UPDATED",
            "STUDENT_DELETED",
            "ROOM_ADDED",
        ],
        required: true
    },
    desc:{
        type:String
    },
    studentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    },
    metadata: {
        // for storing additional info like room number, complaintID, etc.
        type: mongoose.Schema.Types.Mixed
    },
},{
    timestamps: true
})

export const Activity = mongoose.model("Activity", activitySchema)