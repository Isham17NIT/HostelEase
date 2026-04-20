import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { useThemeMode } from "../../app/ThemeContext";
import api from "../../api/axiosInstance";
import { useState } from "react";

export default function ApplyRebate() {
  const { mode, toggleTheme } = useThemeMode();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const [formData, setFormData] = useState({
    fromDate: "",
    toDate: "",
  });

  const handleChange = (e) => {
    setError("");
    setMsg("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitRebate = async () => {
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

    if (from <= today) {
      setError("Rebate start date must be after today.");
      setLoading(false);
      return;
    }
    try {
      const res = await api.post("/student/applyRebate", formData, {
        withCredentials: true,
      });
      if (res.data?.success) {
        setMsg("Rebate submitted successfully");
        setFormData({
          fromDate: "",
          toDate: "",
        });
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Error while submitting rebate",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={500}>
      <Typography variant="h5" gutterBottom>
        Apply Rebate
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
        label="Rebate From"
        type="date"
        margin="normal"
        name="fromDate"
        InputLabelProps={{ shrink: true }}
        inputProps={{
          onClick: (e) => e.target.showPicker(),
        }}
        sx={{
          "& input::-webkit-calendar-picker-indicator": {
            filter: mode === "dark" ? "invert(1)" : "none",
          },
        }}
        onChange={handleChange}
        value={formData.fromDate}
        required
      />

      <TextField
        fullWidth
        label="Rebate till"
        type="date"
        margin="normal"
        name="toDate"
        InputLabelProps={{ shrink: true }}
        inputProps={{
          onClick: (e) => e.target.showPicker(),
        }}
        sx={{
          "& input::-webkit-calendar-picker-indicator": {
            filter: mode === "dark" ? "invert(1)" : "none",
          },
        }}
        onChange={handleChange}
        value={formData.toDate}
        required
      />

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={submitRebate}
        disabled={loading || Object.values(formData).some((val) => !val)}
      >
        Submit
      </Button>
    </Box>
  );
}
