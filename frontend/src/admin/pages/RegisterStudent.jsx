import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  Divider,
  Grid,
} from "@mui/material";
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

  // const fields = [
  //   { title: "Roll Number", type: "text", name: "rollNum" },
  //   { title: "Student Name", type: "text", name: "name" },
  //   { title: "Room Number", type: "text", name: "roomNum" },
  //   { title: "Student's email", type: "email", name: "email" },
  //   { title: "Father's Name", type: "text", name: "fatherName" },
  //   { title: "Mother's Name", type: "text", name: "motherName" },
  //   { title: "Father's email", type: "email", name: "fatherEmail" },
  //   { title: "Mother's email", type: "email", name: "motherEmail" },
  //   { title: "Date of Birth", type: "date", name: "dob" },
  //   { title: "Phone Number", type: "text", name: "phoneNum" },
  //   { title: "House Address", type: "text", name: "address" },
  // ];

  const registerStudent = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await api.post("/admin/students/register", formData, {
        withCredentials: true,
      });
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

  const renderField = (label, name, type = "text", multiline = false) => (
    <TextField
      fullWidth
      label={label}
      type={type}
      multiline={multiline}
      rows={multiline ? 3 : 1}
      value={formData[name]}
      name={name}
      onChange={(e) => {
        setError("");
        setSuccess("");
        setFormData({ ...formData, [name]: e.target.value });
      }}
      onClick={(e) => {
        if (type === "date") {
          e.target.showPicker?.();
        }
      }}
      InputLabelProps={{ shrink: true }}
      sx={{
        "& input::-webkit-calendar-picker-indicator": {
          filter: mode === "dark" ? "invert(0)" : "invert(1)",
          cursor: "pointer"
        },
      }}
      required
    />
  );

  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 900,
          p: 4,
          borderRadius: 3,
        }}
      >

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {/* PERSONAL DETAILS */}
        <Typography variant="h6" mb={2} fontWeight={600}>
          Personal Details
        </Typography>

        <Grid container spacing={2} mb={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            {renderField("Roll Number", "rollNum")}
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            {renderField("Student Name", "name")}
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            {renderField("Date of Birth", "dob", "date")}
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            {renderField("Phone Number", "phoneNum")}
          </Grid>

          <Grid size={12}>
            {renderField("Student Email", "email", "email")}
          </Grid>
        </Grid>

        {/* HOSTEL DETAILS */}
        <Typography variant="h6" mb={2} fontWeight={600}>
          Room Details
        </Typography>

        <Grid container spacing={2} mb={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            {renderField("Room Number", "roomNum")}
          </Grid>
        </Grid>

        {/* PARENT DETAILS */}
        <Typography variant="h6" mb={2} fontWeight={600}>
          Parents' Details
        </Typography>

        <Grid container spacing={2} mb={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            {renderField("Father Name", "fatherName")}
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            {renderField("Father Email", "fatherEmail", "email")}
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            {renderField("Mother Name", "motherName")}
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            {renderField("Mother Email", "motherEmail", "email")}
          </Grid>
        </Grid>

        {/* ADDRESS */}
        <Typography variant="h6" mb={2} fontWeight={600}>
          Address
        </Typography>

        <Box mb={4}>{renderField("House Address", "address", "text")}</Box>

        {/* BUTTON */}
        <Button
          variant="contained"
          fullWidth
          size="large"
          sx={{
            py: 1.5,
            fontWeight: 700,
            borderRadius: 2,
          }}
          onClick={registerStudent}
          disabled={Object.values(formData).some((val) => !val) || loading}
        >
          {loading ? "ADDING..." : "ADD STUDENT"}
        </Button>
      </Paper>
    </Box>
  );
}
