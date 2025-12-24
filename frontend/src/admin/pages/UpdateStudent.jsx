import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  MenuItem,
} from "@mui/material";
import { useState } from "react";

const FIELD_CONFIG = {
  roomNumber: {
    label: "New Room Number",
    type: "text",
  },
  phoneNumber: {
    label: "New Phone Number",
    type: "tel",
  },
  address: {
    label: "New Address",
    type: "text",
    multiline: true,
    rows: 3,
  },
  fatherEmail: {
    label: "Father's Email",
    type: "email",
  },
  motherEmail: {
    label: "Mother's Email",
    type: "email",
  },
};

export default function UpdateStudent() {
  // UPDATE STATES
  const [rollNumber, setRollNumber] = useState("");
  const [selectedField, setSelectedField] = useState("");
  const [value, setValue] = useState("");

  // DELETE STATES
  const [deleteRollNumber, setDeleteRollNumber] = useState("");

  const handleUpdate = () => {
    if (!rollNumber || !selectedField || !value) {
      alert("Please fill all required fields");
      return;
    }

    console.log({
      rollNumber,
      field: selectedField,
      value,
    });
  };

  const handleDelete = () => {
    if (!deleteRollNumber || !adminPassword) {
      alert("Roll number and admin password are required");
      return;
    }

    // API call here
    console.log({
      rollNumber: deleteRollNumber,
      adminPassword,
    });
  };

  const fieldConfig = FIELD_CONFIG[selectedField];

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 480 }}>
        {/*  UPDATE CARD  */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Update Student Details
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <TextField
              label="Student Roll Number"
              fullWidth
              required
              margin="normal"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
            />

            <TextField
              select
              label="Select Field to Update"
              fullWidth
              required
              margin="normal"
              value={selectedField}
              onChange={(e) => {
                setSelectedField(e.target.value);
                setValue("");
              }}
            >
              <MenuItem value="roomNumber">Room Number</MenuItem>
              <MenuItem value="phoneNumber">Phone Number</MenuItem>
              <MenuItem value="address">Address</MenuItem>
              <MenuItem value="fatherEmail">Father's Email</MenuItem>
              <MenuItem value="motherEmail">Mother's Email</MenuItem>
            </TextField>

            {fieldConfig && (
              <TextField
                label={fieldConfig.label}
                type={fieldConfig.type}
                fullWidth
                required
                margin="normal"
                multiline={fieldConfig.multiline}
                rows={fieldConfig.rows}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            )}

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              onClick={handleUpdate}
            >
              UPDATE
            </Button>
          </CardContent>
        </Card>

        {/* DELETE CARD */}
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="error"
              gutterBottom
            >
              Delete Student
            </Typography>

            <Typography variant="body2" color="text.secondary" mb={2}>
              This action is irreversible. Please confirm carefully.
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <TextField
              label="Student Roll Number"
              fullWidth
              required
              margin="normal"
              value={deleteRollNumber}
              onChange={(e) => setDeleteRollNumber(e.target.value)}
            />

            <Button
              fullWidth
              variant="contained"
              color="error"
              sx={{ mt: 3 }}
              onClick={handleDelete}
            >
              DELETE STUDENT
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
