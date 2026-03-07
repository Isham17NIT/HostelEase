import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { clearAuth } from "../utils/clearAuth.js";
import { getCookieOptions } from "../utils/getCookieOptions.js";

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
    throw new ApiError(401, "Invalid password");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // save refreshToken in DB for user (for logout)
  user.refreshToken = refreshToken;
  await user.save();

  // Send refresh token and access token as httpOnly cookie

  res.cookie(
    "refreshToken",
    refreshToken,
    getCookieOptions(process.env.REFRESH_TOKEN_EXPIRY)
  );
  res.cookie(
    "accessToken",
    accessToken,
    getCookieOptions(process.env.ACCESS_TOKEN_EXPIRY)
  );

  const userInfo = { email, role, studentID: user.studentID };

  return res
    .status(200)
    .json(new ApiResponse(200, { user: userInfo }, "Login successful"));
});

// Logout controller
export const logout = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  clearAuth(res, user);

  return res.status(200).json(new ApiResponse(200, null, "Logout successful"));
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
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    if (decoded.id !== String(user._id)) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const accessToken = user.generateAccessToken();

    res.cookie(
      "accessToken",
      accessToken,
      getCookieOptions(process.env.ACCESS_TOKEN_EXPIRY)
    );

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Access token refreshed"));
  } catch (err) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }
});

// Get current user controller
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select(
    "-password -refreshToken"
  );
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully"));
});
