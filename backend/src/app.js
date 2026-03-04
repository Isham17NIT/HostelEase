import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import adminRoutes from "./routes/admin.routes.js";
import studentRoutes from "./routes/student.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))


app.use("/admin", adminRoutes);
app.use("/student", studentRoutes);
app.use("/auth", authRoutes);

app.use(express.json({limit: "16kb"}))

app.use(express.urlencoded({limit: "16kb"}))

app.use(cookieParser())

export { app }