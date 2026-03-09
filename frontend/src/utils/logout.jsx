import api from "../api/axiosInstance.js";
async function logout(navigate) {
  try {
    // backend api call
    await api.post("/auth/logout");
  } catch (error) {
    console.error("Logout API failed:", error);
  } finally {
    localStorage.removeItem("user");
    navigate("/login");
  }
}

export { logout };
