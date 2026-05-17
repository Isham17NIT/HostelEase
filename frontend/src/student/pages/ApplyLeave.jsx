import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  Stack,
  InputAdornment,
} from "@mui/material";
import { useThemeMode } from "../../app/ThemeContext";
import api from "../../api/axiosInstance";
import { useState } from "react";
import Grid from "@mui/material/Grid";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DescriptionIcon from "@mui/icons-material/Description";

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
    <Box sx={{ display: "flex", justifyContent: "center", mt: 2, px: 1 }}>
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 600,
          p: { xs: 2, md: 4 },
          borderRadius: 4,
        }}
      >
        <Box mb={3}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Apply Leave
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Submit hostel leave requests and track approval status.
          </Typography>
        </Box>

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

        <Stack spacing={0}>
          <TextField
            fullWidth
            label="Leave From"
            type="date"
            margin="normal"
            value={formData.fromDate}
            name="fromDate"
            InputLabelProps={{ shrink: true }}
            inputProps={{
              min: new Date().toISOString().split("T")[0],
              onClick: (e) => e.target.showPicker(),
            }}
            sx={{
              "& input::-webkit-calendar-picker-indicator": {
                filter: mode === "dark" ? "invert(0)" : "invert(1)",
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
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
            inputProps={{
              min: formData.fromDate || new Date().toISOString().split("T")[0],
              onClick: (e) => e.target.showPicker(),
            }}
            sx={{
              "& input::-webkit-calendar-picker-indicator": {
                filter: mode === "dark" ? "invert(0)" : "invert(1)",
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
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
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
          />
          <TextField
            fullWidth
            label="Leave Purpose"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            margin="normal"
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
          />

          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                px: 10,
                py: 1.2,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: "bold",
                boxShadow: 3,
              }}
              onClick={submitLeave}
              disabled={loading || Object.values(formData).some((val) => !val)}
            >
              Submit
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
