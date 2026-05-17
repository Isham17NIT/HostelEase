// student specific opn
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Student } from "../models/student.model.js";
import { Leave } from "../models/leave.model.js";
import { Rebate } from "../models/rebate.model.js";
import { Complaint } from "../models/complaint.model.js";
import { User } from "../models/user.model.js";
import { clearAuth } from "../utils/clearAuth.js";
import { paginate } from "../utils/paginate.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const applyForLeave = asyncHandler(async (req, res) => {
  const { fromDate, toDate, address, purpose } = req.body;
  const studentID = req.user.studentID;

  if (!fromDate || !toDate || !address || !purpose)
    throw new ApiError(400, "All fields are required");

  if (!studentID) throw new ApiError(400, "Invalid request");

  const leave = await Leave.create({
    studentID,
    fromDate,
    toDate,
    address,
    purpose,
  });

  if (!leave) {
    throw new ApiError(500, "Failed to create leave application!");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, leave, "Leave application submitted successfully!")
    );
});

export const applyForRebate = asyncHandler(async (req, res) => {
  const { fromDate, toDate } = req.body;
  const studentID = req.user.studentID;

  if (!fromDate || !toDate) throw new ApiError(400, "All fields are required");

  if (!studentID) throw new ApiError(400, "Invalid request");

  const from = new Date(fromDate);
  const to = new Date(toDate);
  const numDays = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;

  const rebate = await Rebate.create({
    studentID,
    fromDate,
    toDate,
    numDays,
  });

  if (!rebate) {
    throw new ApiError(500, "Failed to create rebate application!");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, rebate, "Rebate application submitted successfully!")
    );
});

export const registerComplaint = asyncHandler(async (req, res) => {
  const { type, desc } = req.body;
  const studentID = req.user.studentID;

  if (!type || !desc) {
    throw new ApiError(400, "All fields are required!");
  }

  const student = await Student.findOne({ _id: studentID });
  if (!student) throw new ApiError(404, "Student not found!");

  const complaint = await Complaint.create({
    studentID,
    phoneNum: student.phoneNum,
    roomNum: student.roomNum,
    desc,
    type,
  });

  if (!complaint) {
    throw new ApiError(500, "Failed to register complaint!");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, complaint, "Complaint submitted successfully!"));
});

export const changePassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;
  const email = req.user.email;

  if (!newPassword) throw new ApiError(400, "Please provide password first!");

  const user = await User.findOne({ email });
  user.password = newPassword;
  await user.save();

  // email the password to student
  const mailOptions = {
    from: process.env.MAIL_ID,
    to: req.user.email,
    subject: "Here's your new HostelEase password",
    text: `Password: ${password}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error); //FIX
  }

  await clearAuth(res, user);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Password changed successfully. Please login again"
      )
    );
});

// export const getLeaves = asyncHandler(async (req, res) => {
//   const studentID = req.user.studentID;

//   if (!studentID) {
//     throw new ApiError(400, "Invalid request");
//   }

//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const leaves = await paginate(
//     Leave,
//     { studentID },
//     { fromDate: -1 },
//     page,
//     limit
//   );

//   return res
//     .status(200)
//     .json(new ApiResponse(200, leaves, "Fetched leaves successfully"));
// });

// export const getRebates = asyncHandler(async (req, res) => {
//   const studentID = req.user.studentID;

//   if (!studentID) {
//     throw new ApiError(400, "invalid request");
//   }

//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const rebates = await paginate(
//     Rebate,
//     { studentID },
//     { fromDate: -1 },
//     page,
//     limit
//   );

//   return res
//     .status(200)
//     .json(new ApiResponse(200, rebates, "Fetched rebates successfully"));
// });

// export const getComplaints = asyncHandler(async (req, res) => {
//   const studentID = req.user.studentID;

//   if (!studentID) {
//     throw new ApiError(400, "Invalid request");
//   }

//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const complaints = await paginate(
//     Complaint,
//     { studentID },
//     { fromDate: -1 },
//     page,
//     limit
//   );

//   return res
//     .status(200)
//     .json(new ApiResponse(200, complaints, "Fetched complaints successfully"));
// });

export const getProfile = asyncHandler(async (req, res) => {
  const studentID = req.user.studentID;
  if (!studentID) {
    throw new ApiError(400, "Invalid Request!");
  }
  const studentInfo = await Student.findById(studentID);
  if (!studentInfo) {
    throw new ApiError(404, "Student not found!");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, studentInfo, "Fetched student info successfully")
    );
});

const complaintStats = async (studentID) => {
  await Complaint.aggregate([
    { $match: { studentID } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        resolved: {
          $sum: {
            $cond: [{ $eq: ["$status", "RESOLVED"] }, 1, 0],
          },
        },
      },
    },
  ]);
};

const getTotalLeaveDays = async (studentID) => {
  const leaves = await Leave.find({ studentID });
  return leaves.reduce((sum, l) => {
    const from = l.fromDate;
    const to = l.toDate;
    const days = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
    return sum + days;
  }, 0);
};

const getTotalRebateDays = async (studentID) => {
  const rebates = await Rebate.find({ studentID });
  return rebates.reduce((sum, r) => {
    const from = r.fromDate;
    const to = r.toDate;
    const days = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
    return sum + days;
  }, 0);
};

const getPendingRequestsCount = async (studentID) => {
  const leaves = await Leave.countDocuments({ studentID, status: "PENDING" });
  const rebates = await Rebate.countDocuments({ studentID, status: "PENDING" });
  const complaints = await Complaint.countDocuments({ studentID, status: { $ne: "RESOLVED"} });
  return leaves + rebates + complaints;
};

const getCurrentStatus = async (studentID) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeLeave  = await Leave.findOne({
    studentID,
    status: "APPROVED",
    fromDate: { $lte: today },
    toDate: { $gte: today }
  });

  if(activeLeave)
  {
    return `ON LEAVE till ${activeLeave.toDate.toDateString()}`;
  }
  
  return "IN HOSTEL";
};

export const getDashboardStats = asyncHandler(async (req, res) => {
  const studentID = req.user.studentID;

  const [
    currentStatus,
    resolvedComplaints,
    totalComplaints,
    totalRebateDays,
    totalLeaveDays,
    pendingRequests,
  ] = await Promise.all([
    getCurrentStatus(studentID),
    complaintStats(studentID)[0]?.total || 0,
    complaintStats(studentID)[0]?.resolved || 0,
    getTotalRebateDays(studentID),
    getTotalLeaveDays(studentID),
    getPendingRequestsCount(studentID),
  ]);

  const stats = [
    {
      title: "Current Status",
      value: currentStatus,
      iconKey: "info",
      color: "#2563eb",
    },
    {
      title: "Resolved Complaints",
      value: `${resolvedComplaints}/${totalComplaints}`,
      iconKey: "check_circle",
      color: "#22c55e",
    },
    {
      title: "Rebate Days",
      value: totalRebateDays,
      iconKey: "calendar_month",
      color: "#0ea5e9",
    },
    {
      title: "Leave Days",
      value: totalLeaveDays,
      iconKey: "beach_access",
      color: "#a21caf",
    },
    {
      title: "Pending Requests",
      value: pendingRequests,
      iconKey: "hourglass_empty",
      color: "#ef4444",
    },
  ];
  return res
    .status(200)
    .json(new ApiResponse(200, stats, "Dashboard stats fetched successfully"));
});
