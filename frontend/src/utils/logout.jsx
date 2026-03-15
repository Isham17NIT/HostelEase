import api from "../api/axiosInstance.js";

async function logout(setUser) {
  try {
    // Call backend to invalidate refresh token
    await api.post("/auth/logout", {withCredentials: true});
  } catch (error) {
    console.error("Logout API failed:", error);
    // Continue with client-side cleanup even if API fails
  } finally {
    // Clear user context (which auto-clears localStorage)
    setUser(null);
    
    // Redirect to login
    window.location.href = "/login";
  }
}

export { logout };
