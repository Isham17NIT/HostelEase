import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { useThemeMode } from "../../app/ThemeContext";
import { useState } from "react";
import api from "../../api/axiosInstance";

export default function RegisterStudent() {
  const { mode, toggleTheme } = useThemeMode();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    rollNum: "",
    name: "",
    dob: "",
    email: "",
    roomNum: "",
    phoneNum: "",
    address: "",
    fatherName: "",
    motherName: "",
    fatherEmail: "",
    motherEmail: "",
  });
  const [success, setSuccess] = useState("");

  const fields = [
    { title: "Roll Number", type: "text", name: "rollNum" },
    { title: "Student Name", type: "text", name: "name" },
    { title: "Room Number", type: "text", name: "roomNum" },
    { title: "Student's email", type: "email", name: "email" },
    { title: "Father's Name", type: "text", name: "fatherName" },
    { title: "Mother's Name", type: "text", name: "motherName" },
    { title: "Father's email", type: "email", name: "fatherEmail" },
    { title: "Mother's email", type: "email", name: "motherEmail" },
    { title: "Date of Birth", type: "date", name: "dob" },
    { title: "Phone Number", type: "text", name: "phoneNum" },
    { title: "House Address", type: "text", name: "address" },
  ];

  const registerStudent = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await api.post(
        "/admin/students/register",
        formData,
        { withCredentials: true },
      );
      if (res.data?.success) {
        setSuccess("Student registered successfully!");
        setFormData({
          rollNum: "",
          name: "",
          dob: "",
          email: "",
          roomNum: "",
          phoneNum: "",
          address: "",
          fatherName: "",
          motherName: "",
          fatherEmail: "",
          motherEmail: "",
        });
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Error while registering student",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={500}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Add New Student
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Box mb={2}>
          <Typography color="success.main" fontWeight="bold">
            {success}
          </Typography>
        </Box>
      )}

      {fields.map((field, index) => (
        <TextField
          key={index}
          fullWidth
          label={field.title}
          type={field.type}
          margin="normal"
          value={formData[field.name]}
          name={field.name}
          onChange={(e) => {
            setError("");
            setSuccess("");
            setFormData({ ...formData, [field.name]: e.target.value });
          }}
          InputLabelProps={{ shrink: true }}
          sx={{
            "& input::-webkit-calendar-picker-indicator": {
              filter: mode === "dark" ? "invert(1)" : "none",
            },
          }}
          required
        />
      ))}

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={registerStudent}
        disabled={Object.values(formData).some((val) => !val) && loading}
      >
        ADD STUDENT
      </Button>
    </Box>
  );
}
