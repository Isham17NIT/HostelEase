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
import api from "../../api/axiosInstance";

const FIELD_CONFIG = {
  roomNum: {
    label: "Room Number",
    type: "text",
  },
  phoneNum: {
    label: "Phone Number",
    type: "text",
  },
  address: {
    label: "Address",
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
  const [selectedFields, setSelectedFields] = useState([]); // array of field keys
  const [fieldValues, setFieldValues] = useState({});

  // DELETE STATES
  const [deleteRollNumber, setDeleteRollNumber] = useState("");

  // Handle checkbox select/deselect
  const handleFieldSelect = (key) => {
    setSelectedFields((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  };

  // Handle input change for each field
  const handleFieldChange = (key, value) => {
    setFieldValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpdate = () => {
    if (!rollNumber || selectedFields.length === 0) {
      alert("Please fill all required fields");
      return;
    }
    // Check all selected fields have values
    for (const key of selectedFields) {
      if (!fieldValues[key]) {
        alert(`Please enter value for ${FIELD_CONFIG[key].label}`);
        return;
      }
    }
    // Prepare update object
    const updateData = { rollNumber };
    selectedFields.forEach((key) => {
      updateData[key] = fieldValues[key];
    });
    console.log(updateData);
    // TODO: API call here
  };

  const handleDelete = () => {
    if (!deleteRollNumber) {
      alert("Roll number is required");
      return;
    }
    // API call here
    console.log({
      rollNumber: deleteRollNumber,
    });
  };

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

            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Select fields to update:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 2 }}>
              {Object.entries(FIELD_CONFIG).map(([key, config]) => (
                <label key={key} style={{ marginRight: 16, marginBottom: 8 }}>
                  <input
                    type="checkbox"
                    checked={selectedFields.includes(key)}
                    onChange={() => handleFieldSelect(key)}
                  />
                  {config.label}
                </label>
              ))}
            </Box>

            {selectedFields.map((key) => {
              const config = FIELD_CONFIG[key];
              return (
                <TextField
                  key={key}
                  label={config.label}
                  type={config.type}
                  fullWidth
                  required
                  margin="normal"
                  multiline={config.multiline}
                  rows={config.rows}
                  value={fieldValues[key] || ""}
                  onChange={(e) => handleFieldChange(key, e.target.value)}
                />
              );
            })}

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
