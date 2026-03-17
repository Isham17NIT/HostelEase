// admin-only APIs
import express from "express";
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
  updateStudentDetails,
  getDashboardStats,
  getRecentActivity
} from "../controllers/admin.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = express.Router();

// protect all admin routes
router.use(authMiddleware);
router.use(roleMiddleware("ADMIN"));

// Dashboard
router.route("/dashboard/stats").get(getDashboardStats);
router.route("/dashboard/activity").get(getRecentActivity)

// Complaints
router.route("/complaints/pending").get(getPendingComplaints);
router.route("/complaints/:id").patch(updateComplaintStatus);

// Leaves
router.route("/leaves/pending").get(getPendingLeaves);
router.route("/leaves/:id").patch(updateLeaveStatus);

// Rebates
router.route("/rebates/pending").get(getPendingRebates);
router.route("/rebates/:id").patch(updateRebateStatus);

// Rooms
router.route("/rooms/check-availability").post(checkRoomAvailability);
router.route("/rooms/add").post(addRoom);

// Student management
router.route("/students/register").post(registerStudent);
router.route("/students/delete/:rollNum").delete(deleteStudent);
router.route("/students/update/:rollNum").put(updateStudentDetails);

export default router;
