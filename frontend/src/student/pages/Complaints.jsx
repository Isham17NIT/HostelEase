import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Divider,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Alert,
} from "@mui/material";
import api from "../../api/axiosInstance";

export default function Complaints() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const [formData, setFormData] = useState({
    type: "",
    desc: "",
  });

  const handleChange = (e) => {
    setError("");
    setMsg("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitComplaint = async () => {
    setLoading(true);
    setError("");
    setMsg("");

    try {
      const res = await api.post("/student/registerComplaint", formData, {
        withCredentials: true,
      });
      if (res.data?.success) {
        setMsg("Complaint submitted successfully");
        setFormData({
          type: "",
          desc: "",
        });
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Error while submitting complaint",
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
            Register Complaint
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Submit hostel-related issues and track their resolution.
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

        <Stack spacing={2} sx={{ mb: 0.5 }}>
          <FormControl
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
          >
            <InputLabel id="complaint-type-label">Complaint Type</InputLabel>
            <Select
              labelId="complaint-type-label"
              label="Complaint Type"
              onChange={handleChange}
              required
              name="type"
              value={formData.type}
            >
              <MenuItem value="ELECTRICITY">Electricity</MenuItem>
              <MenuItem value="WATER">Water</MenuItem>
              <MenuItem value="FURNITURE">Furniture</MenuItem>
              <MenuItem value="CLEANING">Cleaning</MenuItem>
              <MenuItem value="INTERNET">WiFi/LAN</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Complaint Description"
            fullWidth
            multiline
            rows={4}
            name="desc"
            value={formData.desc}
            onChange={handleChange}
            InputProps={{ maxLength: 200 }}
            error={formData.desc.length > 200}
            helperText={`${formData.desc.length}/200 characters`}
            placeholder="Describe the issue briefly (max 200 characters)"
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
          />

          <Button
            variant="contained"
            size="large"
            sx={{
              alignSelf: "center",
              px: 10,
              py: 1.2,
              // mt: 1,
              borderRadius: 3,
              textTransform: "none",
              fontWeight: "bold",
              boxShadow: 3,
            }}
            onClick={submitComplaint}
            disabled={loading || Object.values(formData).some((val) => !val)}
          >
            Submit
          </Button>
        </Stack>

        {/* <Divider sx={{ mb: 3 }} /> */}

        {/* ================= MY COMPLAINTS ================= */}
        {/* <Typography variant="h5" gutterBottom>
        My Complaints
      </Typography> */}

        {/* Header */}
        {/* <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "120px 1fr 150px",
          fontWeight: "bold",
          mb: 1,
        }}
      >
        <Typography>ID</Typography>
        <Typography>Created At</Typography>
        <Typography>Category</Typography>
      </Box> */}

        {/* <Divider /> */}

        {/* Rows */}
        {/* {[
        { id: "CMP001", issue: "Fan not working", status: "Resolved" },
        { id: "CMP002", issue: "Water leakage", status: "In Progress" },
        { id: "CMP003", issue: "Broken chair", status: "Pending" },
      ].map((c) => (
        <Box
          key={c.id}
          sx={{
            display: "grid",
            gridTemplateColumns: "120px 1fr 150px",
            alignItems: "center",
            py: 2,
          }}
        >
          <Typography>{c.id}</Typography>
          <Typography>{c.issue}</Typography>
          <Chip
            label={c.status}
            color={
              c.status === "Resolved"
                ? "success"
                : c.status === "In Progress"
                ? "warning"
                : "default"
            }
          /> */}
        {/* </Box> */}
        {/* ))} */}
      </Paper>
    </Box>
  );
}
