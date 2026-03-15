export const clearAuth = async (res, user) => {
  // remove refreshtoken from user database
  user.refreshToken = null;
  await user.save();

  const clearOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/", // means cookie cleared for entire site and not just a specific route
  };

  res.clearCookie("refreshToken", clearOptions);
  res.clearCookie("accessToken", clearOptions);
};
