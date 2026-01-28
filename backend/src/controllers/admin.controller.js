// admin specific opn ----> update student details and delete student logic left

import { Complaint } from "../models/complaint.model.js";
import { Student } from "../models/student.model.js";
import { Leave } from "../models/leave.model.js";
import { Rebate } from "../models/rebate.model.js";
import { Room } from "../models/room.model.js";

export const getPendingComplaints = async (req, res) => {
  try {
    const pendingComplaints = await Complaint.aggregate([
      {
        $match: { status: "PENDING" },
        $lookup: {
          from: "students", // collection name in mongodb
          localField: "studentID",
          foreignField: "_id",
          as: "studentInfo",
        },
      },
    ]);
    return res.status(200).json({
      success: true,
      message: "Pending complaints fetched successfully",
      data: pendingComplaints,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching pending complaints",
      error: error.message,
    });
  }
};

export const getPendingLeaves = async (req, res) => {
  try {
    const pendingLeaves = await Leave.find({ status: "PENDING" });
    return res.status(200).json({
      success: true,
      message: "Pending leaves fetched successfully",
      data: pendingLeaves,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching pending leaves",
      error: error.message,
    });
  }
};

export const getPendingRebates = async (req, res) => {
  try {
    const pendingRebates = await Rebate.find({ status: "PENDING" });
    return res.status(200).json({
      success: true,
      message: "Pending rebates fetched successfully",
      data: pendingRebates,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching pending rebates",
      error: error.message,
    });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    const { leaveId, newStatus } = req.body;

    const updatedLeave = await Leave.findByIdAndUpdate(
      leaveId,
      { status: newStatus },
      { new: true, runValidators: true }
    );

    if (!updatedLeave) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Leave status updated to ${newStatus}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while updating leave status",
      error: error.message,
    });
  }
};

export const updateRebateStatus = async (req, res) => {
  try {
    const { rebateId, newStatus } = req.body;

    const updatedRebate = await Rebate.findByIdAndUpdate(
      rebateId,
      { status: newStatus },
      { new: true, runValidators: true }
    );

    if (!updatedRebate) {
      return res.status(404).json({
        success: false,
        message: "Rebate request not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Rebate status updated to ${newStatus}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while updating rebate status",
      error: error.message,
    });
  }
};

export const updateComplaintStatus = async (req, res) => {
  try {
    const { complaintId, newStatus } = req.body;

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { status: newStatus },
      { new: true, runValidators: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Complaint marked as ${newStatus}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while updating complaint status",
      error: error.message,
    });
  }
};

export const checkRoomAvailability = async (req, res) => {
  try {
    const room = req.body.roomNum?.trim().toLowerCase();
    if (!room) {
      return res.status(400).json({
        success: false,
        message: "Room number can't be empty",
      });
    }

    const roomDetails = await Room.findOne({ roomNum: room });
    if (!roomDetails) {
      return res.status(404).json({
        success: false,
        message: "Room number not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Room details fetched successfully",
      data: { status: roomDetails.status },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching room details",
      error: error.message,
    });
  }
};

export const addRoom = async (req, res) => {
  try {
    const roomNum = req.body.roomNum?.trim().toLowerCase();
    if (!roomNum) {
      return res.status(400).json({
        success: false,
        message: "Room number can't be empty",
      });
    }

    const alreadyExists = await Room.findOne({ roomNum });
    if (alreadyExists) {
      return res.status(409).json({
        success: false,
        message: "Room already exists",
      });
    }

    const newRoom = await Room.create({ roomNum });

    return res.status(201).json({
      success: true,
      message: "Room added successfully",
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Room already exists",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Error while adding room",
      error: error.message,
    });
  }
};

export const registerStudent = async (req, res) => {
  try {
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
      return res.status(400).json({
        success: false,
        message: "All fields are required!"
      })
    }

    // Check if student with same rollNum exists
    const existingStudent = await Student.findOne({ rollNum });
    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "Student with this roll number already exists."
      });
    }

    // Check if room exists and is vacant
    const room = await Room.findOne({ roomNum: roomNum.trim().toLowerCase() });
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found."
      });
    }
    if (room.status !== "VACANT") {
      return res.status(409).json({
        success: false,
        message: "Room is not vacant."
      });
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

    // Mark room as OCCUPIED
    room.status = "OCCUPIED";
    await room.save();

    return res.status(201).json({
      success: true,
      message: "Student registered successfully.",
      data: student
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while registering student",
      error: error.message
    });
  }
};

export const deleteStudent = async(req, res)=>{
  try {
    const { rollNum } = req.body;
    if (!rollNum) {
      return res.status(400).json({
        success: false,
        message: "Roll number is required!"
      });
    }

    // Find student by rollNum
    const student = await Student.findOne({ rollNum });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found!"
      });
    }

    // Free up the room
    const room = await Room.findOne({ roomNum: student.roomNum });
    if (room) {
      room.status = "VACANT";
      await room.save();
    }

    // Delete the student
    await Student.deleteOne({ rollNum });

    return res.status(200).json({
      success: true,
      message: "Student deleted successfully!"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while deleting student!",
      error: error.message
    });
  }
}


