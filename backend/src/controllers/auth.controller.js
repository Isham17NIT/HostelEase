// need to check



import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";

// Login controller
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // save refreshToken in DB for user (for logout)
  user.refreshToken = refreshToken;
  await user.save();

  // Send refresh token as httpOnly cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        accessToken,
        user: { id: user._id, email: user.email, name: user.name, role: user.role },
      },
      "Login successful"
    )
  );
});

// Refresh access token controller
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new ApiError(401, "No refresh token provided");
  }
  try {
    // Find user with this refresh token
    const user = await User.findOne({ refreshToken });
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }
    // Verify refresh token
    const decoded = await user.constructor.jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    if (decoded.id !== String(user._id)) {
      throw new ApiError(401, "Invalid refresh token");
    }
    const accessToken = user.generateAccessToken();
    return res.status(200).json(new ApiResponse(200, { accessToken }, "Access token refreshed"));
  } catch (err) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }
});

// Get current user controller
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});