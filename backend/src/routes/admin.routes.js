// admin-only APIs
import express from "express"
import {
  getPendingComplaints,
  getPendingLeaves,
  getPendingRebates,
  updateComplaintStatus,
  updateLeaveStatus,
  updateRebateStatus,
  checkRoomAvailability,
  addRoom,
  registerStudent,
  deleteStudent,
  updateStudentDetails
} from "../controllers/admin.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = express.Router()

//protect all admin routes
router.use(authMiddleware)
router.use(roleMiddleware("ADMIN"))

// Complaints
router.route("/complaints/pending").get(getPendingComplaints)
router.route("/complaints/update-status").post(updateComplaintStatus)

// Leaves
router.route("/leaves/pending").get(getPendingLeaves)
router.route("/leaves/update-status").post(updateComplaintStatus)

// Rebates
router.route("/rooms/check-availability").post(checkRoomAvailability);
router.route("/rooms/add").post(addRoom)

// Student management
router.route("/students/register").post(registerStudent);
router.route("/students/delete").post(deleteStudent);
router.route("/students/update").put(updateStudentDetails);

export default router;