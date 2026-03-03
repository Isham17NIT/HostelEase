import jwt from "jsonwebtoken"; // for token verification
import { User } from "../models/user.model.js";

// authMiddleware checks if the request is authenticated before allowing access to protected routes

export const authMiddleware = async(req, res, next)=>{
    // JWT is usually sent in the Authorization header as "Bearer <token>"
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // extract the token

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        req.user = user; // attach user info to request object
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
    
}