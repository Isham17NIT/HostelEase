import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    studentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },

    roomNumber: { //will come from logged in student's info
      type: String,
      required: true
    },

    phoneNumber:{ //student's phone number will come from logged in info
        type: String,
        required: true
    },

    type: {
      type: String,
      enum: ["ELECTRICITY","WATER","FURNITURE","CLEANING","INTERNET"],
      required: true
    },

    desc: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "RESOLVED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export const Complaint = mongoose.model("Complaint", complaintSchema);
