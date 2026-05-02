import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  Grid,
  Chip,
  Stack,
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
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key],
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
      <Grid container spacing={3} alignItems="flex-start">
        {/*  UPDATE CARD  */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ display: "flex", flexDirection: "column" }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Update Student Details
              </Typography>

              <Divider sx={{ mb: 1 }} />

              <TextField
                label="Student Roll Number"
                fullWidth
                required
                margin="normal"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
              />

              <Typography variant="subtitle1" sx={{ mt: 1, mb: 1 }}>
                Choose which details you want to modify:
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                useFlexGap
                flexWrap="wrap"
                sx={{ mb: 3 }}
              >
                {Object.entries(FIELD_CONFIG).map(([key, config]) => (
                  <Chip
                    key={key}
                    label={config.label}
                    clickable
                    color={selectedFields.includes(key) ? "primary" : "default"}
                    variant={
                      selectedFields.includes(key) ? "filled" : "outlined"
                    }
                    onClick={() => handleFieldSelect(key)}
                  />
                ))}
              </Stack>

              <Grid container spacing={2}>
                {selectedFields.map((key) => {
                  const config = FIELD_CONFIG[key];

                  return (
                    <Grid
                      key={key}
                      size={{
                        xs: 12,
                        md: config.multiline ? 12 : 6,
                      }}
                    >
                      <TextField
                        label={config.label}
                        type={config.type}
                        fullWidth
                        required
                        multiline={config.multiline}
                        rows={config.rows}
                        value={fieldValues[key] || ""}
                        onChange={(e) => handleFieldChange(key, e.target.value)}
                      />
                    </Grid>
                  );
                })}
              </Grid>

              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
                onClick={handleUpdate}
              >
                UPDATE
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* DELETE CARD */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              border: "1px solid",
              borderColor: "error.light",
              minHeight: 320
            }}
          >
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
                sx={{ mt: 5.5 }}
                onClick={handleDelete}
              >
                DELETE STUDENT
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
