export const getCookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: Number(maxAge),
});
