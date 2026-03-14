import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { useThemeMode } from "../../app/ThemeContext";
import api from "../../api/axiosInstance";
import { useState } from "react";

export default function ApplyLeave() {
  const { mode, toggleTheme } = useThemeMode();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const [formData, setFormData] = useState({
    fromDate: "",
    toDate: "",
    address: "",
    purpose: "",
  });

  const handleChange = (e) => {
    setError("");
    setMsg("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitLeave = async () => {
    setLoading(true);
    setError("");
    setMsg("");

    if (formData.fromDate > formData.toDate) {
      setError("fromDate can't be greater than toDate");
      setLoading(false);
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time part for accurate comparison

    const from = new Date(formData.fromDate);

    if (from < today) {
      setError("Leave start date can't be before today.");
      setLoading(false);
      return;
    }
    try {
      const res = await api.post("/student/applyLeave", formData, {
        withCredentials: true,
      });
      if (res.data?.success) {
        setMsg("Leave submitted successfully");
        setFormData({
          fromDate: "",
          toDate: "",
          address: "",
          purpose: "",
        });
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error while submitting leave");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={500}>
      <Typography variant="h5" gutterBottom>
        Apply Leave
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {msg && (
        <Box mb={2}>
          <Typography color="success.main" fontWeight="bold">
            {msg}
          </Typography>
        </Box>
      )}

      <TextField
        fullWidth
        label="Leave From"
        type="date"
        margin="normal"
        value={formData.fromDate}
        name="fromDate"
        InputLabelProps={{ shrink: true }}
        sx={{
          "& input::-webkit-calendar-picker-indicator": {
            filter: mode === "dark" ? "invert(1)" : "none",
          },
        }}
        onChange={handleChange}
        required
      />

      <TextField
        fullWidth
        label="Leave Till"
        type="date"
        margin="normal"
        value={formData.toDate}
        name="toDate"
        InputLabelProps={{ shrink: true }}
        sx={{
          "& input::-webkit-calendar-picker-indicator": {
            filter: mode === "dark" ? "invert(1)" : "none",
          },
        }}
        onChange={handleChange}
        required
      />

      <TextField
        fullWidth
        label="Leave Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Leave Purpose"
        name="purpose"
        value={formData.purpose}
        onChange={handleChange}
        margin="normal"
        required
      />

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={submitLeave}
        disabled={loading || Object.values(formData).some((val) => !val)}
      >
        Submit
      </Button>
    </Box>
  );
}
