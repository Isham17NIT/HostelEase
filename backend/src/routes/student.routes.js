// student-only APIs
import express from "express"

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = express.Router()

// protect all student routes
router.use(authMiddleware)
router.use(roleMiddleware("STUDENT"))

// student routes to be written

export default router;