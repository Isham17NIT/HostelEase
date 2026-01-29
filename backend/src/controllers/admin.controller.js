// admin specific opn 

import { Complaint } from "../models/complaint.model.js";
import { Student } from "../models/student.model.js";
import { Leave } from "../models/leave.model.js";
import { Rebate } from "../models/rebate.model.js";
import { Room } from "../models/room.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getPendingComplaints = asyncHandler(async (req, res) => {
  const pendingComplaints = await Complaint.aggregate([
    {
      $match: { status: "PENDING" },
      $lookup: {
        from: "students",
        localField: "studentID",
        foreignField: "_id",
        as: "studentInfo",
      },
    },
  ]);
  return res.status(200).json(new ApiResponse(200, pendingComplaints, "Pending complaints fetched successfully"));
});

export const getPendingLeaves = asyncHandler(async (req, res) => {
  const pendingLeaves = await Leave.find({ status: "PENDING" });
  return res.status(200).json(new ApiResponse(200, pendingLeaves, "Pending leaves fetched successfully"));
});

export const getPendingRebates = asyncHandler(async (req, res) => {
  const pendingRebates = await Rebate.find({ status: "PENDING" });
  return res.status(200).json(new ApiResponse(200, pendingRebates, "Pending rebates fetched successfully"));
});

export const updateLeaveStatus = asyncHandler(async (req, res) => {
  const { leaveId, newStatus } = req.body;
  const updatedLeave = await Leave.findByIdAndUpdate(
    leaveId,
    { status: newStatus },
    { new: true, runValidators: true }
  );
  if (!updatedLeave) {
    throw new ApiError(404, "Leave request not found");
  }
  return res.status(200).json(new ApiResponse(200, updatedLeave, `Leave status updated to ${newStatus}`));
});

export const updateRebateStatus = asyncHandler(async (req, res) => {
  const { rebateId, newStatus } = req.body;
  const updatedRebate = await Rebate.findByIdAndUpdate(
    rebateId,
    { status: newStatus },
    { new: true }
  );
  if (!updatedRebate) {
    throw new ApiError(404, "Rebate request not found");
  }
  return res.status(200).json(new ApiResponse(200, updatedRebate, `Rebate status updated to ${newStatus}`));
});

export const updateComplaintStatus = asyncHandler(async (req, res) => {
  const { complaintId, newStatus } = req.body;
  const updatedComplaint = await Complaint.findByIdAndUpdate(
    complaintId,
    { status: newStatus },
    { new: true }
  );
  if (!updatedComplaint) {
    throw new ApiError(404, "Complaint not found");
  }
  return res.status(200).json(new ApiResponse(200, updatedComplaint, `Complaint marked as ${newStatus}`));
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
  return res.status(200).json(new ApiResponse(200, { status: roomDetails.status }, "Room details fetched successfully"));
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
  return res.status(201).json(new ApiResponse(201, newRoom, "Room added successfully"));
});

export const registerStudent = asyncHandler(async (req, res) => {
  const {
    rollNum,
    name,
    dob,
    roomNum,
    phoneNum,
    address,
    fatherName,
    motherName,
    fatherEmail,
    motherEmail
  } = req.body;

  // Check for missing fields
  const fields = {
    rollNum,
    name,
    dob,
    roomNum,
    phoneNum,
    address,
    fatherName,
    motherName,
    fatherEmail,
    motherEmail
  };
  if(Object.values(fields).some(value => !value)){
    throw new ApiError(400, "All fields are required!");
  }
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
    motherEmail
  });
  
  room.status = "OCCUPIED";
  await room.save();
  return res.status(201).json(new ApiResponse(201, student, "Student registered successfully."));
});

// ------------------ user logic to be implemented in delete student--------------------------
export const deleteStudent = asyncHandler(async (req, res) => {
  const { rollNum } = req.body;
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
  return res.status(200).json(new ApiResponse(200, null, "Student deleted successfully!"));
});

export const updateStudentDetails = asyncHandler(async (req, res) => {
  const { rollNum, ...fieldsToUpdate } = req.body;
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

  return res.status(200).json(new ApiResponse(200, student, "Student details updated successfully!"));
});


