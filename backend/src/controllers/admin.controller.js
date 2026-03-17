// admin specific opn

import { Complaint } from "../models/complaint.model.js";
import { Student } from "../models/student.model.js";
import { Leave } from "../models/leave.model.js";
import { Rebate } from "../models/rebate.model.js";
import { Room } from "../models/room.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import nodemailer from "nodemailer";
import { paginate } from "../utils/paginate.js";
import { Activity } from "../models/activity.model.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalStudents,
    pendingLeaves,
    availableRooms,
    pendingRebates,
    openComplaints,
  ] = await Promise.all([
    Student.countDocuments(),
    Leave.countDocuments({ staus: "PENDING" }),
    Room.countDocuments({ status: "VACANT" }),
    Rebate.countDocuments({ status: "PENDING" }),
    Complaint.countDocuments({ status: "PENDING" }),
  ]);
  return res.status(200).json(new ApiResponse(200, {
    totalStudents,
    pendingLeaves,
    availableRooms,
    pendingRebates,
    openComplaints,
  }, "Dashboard stats fetched successfully"))
});

export const getRecentActivity = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const activity = await paginate(Activity, {}, { createdAt: -1 }, page, limit);

  return res
    .status(200)
    .json(
      new ApiResponse(200, activity, "Recent activities fetched successfully")
    );
});

// TODO---> ADD pagination support here
export const getPendingComplaints = asyncHandler(async (req, res) => {
  const pendingComplaints = await Complaint.find({ status: "PENDING" });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        pendingComplaints,
        "Pending complaints fetched successfully"
      )
    );
});

export const getPendingLeaves = asyncHandler(async (req, res) => {
  const pendingLeaves = await Leave.find({ status: "PENDING" });
  return res
    .status(200)
    .json(
      new ApiResponse(200, pendingLeaves, "Pending leaves fetched successfully")
    );
});

export const getPendingRebates = asyncHandler(async (req, res) => {
  const pendingRebates = await Rebate.find({ status: "PENDING" });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        pendingRebates,
        "Pending rebates fetched successfully"
      )
    );
});

export const updateLeaveStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { newStatus } = req.body;

  const updatedLeave = await Leave.findByIdAndUpdate(
    id,
    { status: newStatus },
    { new: true, runValidators: true }
  );
  if (!updatedLeave) {
    throw new ApiError(404, "Leave request not found");
  }
  if (newStatus === "APPROVED") {
    // then send mail to parents
    // find student info
    const student = await Student.findById(updatedLeave.studentID);
    if (student) {
      const mailOptions = {
        from: process.env.MAIL_ID,
        to: [student.fatherEmail, student.motherEmail],
        subject: `Your ward ${student.name} has applied leave`,
        text: `From: ${updatedLeave.fromDate}, To: ${updatedLeave.toDate}, Address: ${updatedLeave.address}, Purpose: ${updatedLeave.purpose}`,
      };
      try {
        await transporter.sendMail(mailOptions);
      } catch (error) {
        console.log(error); // fix
      }
    }
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedLeave, `Leave status updated to ${newStatus}`)
    );
});

export const updateRebateStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { newStatus } = req.body;

  const updatedRebate = await Rebate.findByIdAndUpdate(
    id,
    { status: newStatus },
    { new: true }
  );
  if (!updatedRebate) {
    throw new ApiError(404, "Rebate request not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedRebate,
        `Rebate status updated to ${newStatus}`
      )
    );
});

export const updateComplaintStatus = asyncHandler(async (req, res) => {
  const { newStatus } = req.body;
  const { id } = req.params;

  const updatedComplaint = await Complaint.findByIdAndUpdate(
    id,
    { status: newStatus },
    { new: true }
  );
  if (!updatedComplaint) {
    throw new ApiError(404, "Complaint not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedComplaint, `Complaint marked as ${newStatus}`)
    );
});

export const checkRoomAvailability = asyncHandler(async (req, res) => {
  const room = req.body.roomNum?.trim().toLowerCase();
  if (!room) {
    throw new ApiError(400, "Room number can't be empty");
  }
  const roomDetails = await Room.findOne({ roomNum: room });
  if (!roomDetails) {
    throw new ApiError(404, "Room number not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { status: roomDetails.status },
        "Room details fetched successfully"
      )
    );
});

export const addRoom = asyncHandler(async (req, res) => {
  const roomNum = req.body.roomNum?.trim().toLowerCase();
  if (!roomNum) {
    throw new ApiError(400, "Room number can't be empty");
  }
  const alreadyExists = await Room.findOne({ roomNum });
  if (alreadyExists) {
    throw new ApiError(409, "Room already exists");
  }
  const newRoom = await Room.create({ roomNum });
  return res
    .status(201)
    .json(new ApiResponse(201, newRoom, "Room added successfully"));
});

export const registerStudent = asyncHandler(async (req, res) => {
  const {
    rollNum,
    name,
    dob,
    email,
    roomNum,
    phoneNum,
    address,
    fatherName,
    motherName,
    fatherEmail,
    motherEmail,
  } = req.body;

  // Check for missing fields
  const fields = {
    rollNum,
    name,
    dob,
    email,
    roomNum,
    phoneNum,
    address,
    fatherName,
    motherName,
    fatherEmail,
    motherEmail,
  };
  if (Object.values(fields).some((value) => !value)) {
    throw new ApiError(400, "All fields are required!");
  }

  // Check if user with same email exists
  const existingUser = await User.findOne({ email });
  if (existingUser)
    throw new ApiError(409, "User with this email already exists.");

  // Check if student with same rollNum exists
  const existingStudent = await Student.findOne({ rollNum });
  if (existingStudent) {
    throw new ApiError(409, "Student with this roll number already exists.");
  }

  // Check if room exists and is vacant
  const room = await Room.findOne({ roomNum: roomNum.trim().toLowerCase() });
  if (!room) {
    throw new ApiError(404, "Room not found.");
  }
  if (room.status !== "VACANT") {
    throw new ApiError(409, "Room is not vacant.");
  }

  // Create student
  const student = await Student.create({
    rollNum,
    name,
    dob,
    roomNum: roomNum.trim().toLowerCase(),
    phoneNum,
    address,
    fatherName,
    motherName,
    fatherEmail,
    motherEmail,
  });

  room.status = "OCCUPIED";
  await room.save();

  const password = User.generateStrongPassword();

  // Create user
  const user = await User.create({
    email,
    password: password,
    role: "STUDENT",
    studentID: student._id,
  });

  // email the password to student
  const mailOptions = {
    from: process.env.MAIL_ID,
    to: email,
    subject: "Welcome to HostelEase",
    text: `Your password is: ${password} and Room No.: ${roomNum}. You can later change your password!`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error); // fix
  }

  return res
    .status(201)
    .json(new ApiResponse(201, student, "Student registered successfully."));
});

export const deleteStudent = asyncHandler(async (req, res) => {
  const { rollNum } = req.params;

  if (!rollNum) {
    throw new ApiError(400, "Roll number is required!");
  }

  // Find student by rollNum
  const student = await Student.findOne({ rollNum });
  if (!student) {
    throw new ApiError(404, "Student not found!");
  }

  // Free up the room
  const room = await Room.findOne({ roomNum: student.roomNum });
  if (room) {
    room.status = "VACANT";
    await room.save();
  }

  // Delete the student
  await Student.deleteOne({ rollNum });

  // delete from user also
  const user = await User.findOne({ studentID: student._id });
  if (user) {
    await User.deleteOne({ studentID: student._id });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Student deleted successfully!"));
});

// -----------------need to check updateStudent-----------------------
export const updateStudentDetails = asyncHandler(async (req, res) => {
  const { rollNum } = req.params;
  const fieldsToUpdate = req.body;

  if (!rollNum || rollNum.trim() === "") {
    throw new ApiError(400, "Roll number is required!");
  }

  const student = await Student.findOne({ rollNum });
  if (!student) {
    throw new ApiError(404, "Student not found!");
  }

  if (fieldsToUpdate.roomNum && fieldsToUpdate.roomNum !== student.roomNum) {
    const oldRoom = await Room.findOne({ roomNum: student.roomNum });
    if (oldRoom) {
      oldRoom.status = "VACANT";
      await oldRoom.save();
    }
    const newRoomNum = fieldsToUpdate.roomNum.trim().toLowerCase();
    const newRoom = await Room.findOne({ roomNum: newRoomNum });
    if (!newRoom) {
      throw new ApiError(404, "New room not found.");
    }
    if (newRoom.status !== "VACANT") {
      throw new ApiError(409, "New room is not vacant.");
    }
    newRoom.status = "OCCUPIED";
    await newRoom.save();
    student.roomNum = newRoomNum;
  }

  // Update all fields except roomNum
  Object.keys(fieldsToUpdate).forEach((key) => {
    if (key === "roomNum") return;
    if (fieldsToUpdate[key] !== undefined) {
      student[key] = fieldsToUpdate[key];
    }
  });

  await student.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, student, "Student details updated successfully!")
    );
});
