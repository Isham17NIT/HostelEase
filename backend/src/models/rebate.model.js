import mongoose from "mongoose";

const rebateSchema = new mongoose.Schema(
  {
    studentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    fromDate: {
      type: Date, 
      required: true,
    },

    joiningDate: {
      type: Date, 
      required: true,
    },

    numDays: { //will be calculated in frontend's logic
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export const Rebate = mongoose.model("Rebate", rebateSchema);
