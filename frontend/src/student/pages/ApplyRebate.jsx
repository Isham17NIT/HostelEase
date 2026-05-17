import {
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  Stack,
  Alert,
} from "@mui/material";
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
            Apply Rebate
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Submit rebate requests for unused mess services.
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
            label="Rebate From"
            type="date"
            margin="normal"
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
            value={formData.toDate}
            required
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
              onClick={submitRebate}
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
