import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    studentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
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
