import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // prevents page reload

    setError("");
    setLoading(true);
    try {
      //backend api call
      const response = await api.post(
        "http://localhost:8000/auth/login",
        {
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true, // Allows cookies to be sent/received
        },
      );

      const user = response.data.data.user;

      localStorage.setItem("user", JSON.stringify(user));

      //navigate based on role
      if (user.role === "ADMIN") navigate("/admin");
      else navigate("/student");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <button type="submit">Login</button>
    </form>
  );
}
