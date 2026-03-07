// student-only APIs
import express from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

import {
  registerComplaint,
  changePassword,
  applyForRebate,
  applyForLeave,
  getLeaves,
  getRebates,
  getComplaints,
} from "../controllers/student.controller.js";

const router = express.Router();

// protect all student routes
router.use(authMiddleware);
router.use(roleMiddleware("STUDENT"));

// student routes
router.route("/registerComplaint").post(registerComplaint);
router.route("/applyRebate").post(applyForRebate);
router.route("/applyLeave").post(applyForLeave);
router.route("/changePassword").post(changePassword);

router.route("/leaves").get(getLeaves);
router.route("/rebates").get(getRebates);
router.route("/complaints").get(getComplaints);

export default router;
