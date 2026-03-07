import {
  login,
  logout,
  refreshAccessToken,
  getCurrentUser,
} from "../controllers/auth.controller.js";
import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/login").post(login);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/me").get(authMiddleware, getCurrentUser);
router.route("/logout").post(authMiddleware, logout);

export default router;
