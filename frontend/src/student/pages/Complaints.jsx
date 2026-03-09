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
  TableRow
} from "@mui/material";

export default function Complaints() {
  const [type, setType] = useState("");
  const [desc, setDesc] = useState("");

  const charCount = desc.length;

  return (
    <Box sx={{ maxWidth: 900 }}>
      {/* ================= REGISTER COMPLAINT ================= */}
      <Typography variant="h5" gutterBottom>
        Register a Complaint
      </Typography>

      <Stack spacing={2} sx={{ mb: 4 }}>
        {/* Complaint Type */}
        <FormControl fullWidth>
          <InputLabel id="complaint-type-label">
            Complaint Type
          </InputLabel>
          <Select
            labelId="complaint-type-label"
            label="Complaint Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <MenuItem value="ELECTRICITY">Electricity</MenuItem>
            <MenuItem value="WATER">Water</MenuItem>
            <MenuItem value="FURNITURE">Furniture</MenuItem>
            <MenuItem value="CLEANING">Cleaning</MenuItem>
            <MenuItem value="INTERNET">WiFi/LAN</MenuItem>
          </Select>
        </FormControl>

        {/* Complaint Description */}
        <TextField
          label="Complaint Description"
          fullWidth
          multiline
          rows={4}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          InputProps={{ maxLength: 200 }}
          error={charCount > 200}
          helperText={`${charCount}/200 characters`}
          placeholder="Describe the issue briefly (max 200 characters)"
          required
        />

        {/* Submit */}
        <Button
          variant="contained"
          sx={{ alignSelf: "flex-start" }}
        >
          Register Complaint
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

    </Box>
  );
}
