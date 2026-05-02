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
  const [rollNum, setRollNum] = useState("");
  const [selectedFields, setSelectedFields] = useState([]); // array of field keys
  const [fieldValues, setFieldValues] = useState({});
  const [deleteRollNum, setDeleteRollNum] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [updateError, setUpdateError] = useState("");
  const [updateMsg, setUpdateMsg] = useState("");

  const handleFieldSelect = (key) => {
    setSelectedFields((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key],
    );
  };

  const handleFieldChange = (key, value) => {
    setFieldValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpdate = async() => {
    setUpdateError("");
    setUpdateMsg("");
    setError("");
    setMsg("");

    if (!rollNum || selectedFields.length === 0) {
      return;
    }

    // Check all selected fields have values
    for (const key of selectedFields) {
      if (!fieldValues[key]) {
        alert(`Please enter value for ${FIELD_CONFIG[key].label}`);
        return;
      }
    }

    setLoading(true);

    const updateData = {};
    selectedFields.forEach((key) => {
      updateData[key] = fieldValues[key];
    });

    try {
      const res = await api.put(`/admin/students/update/${rollNum}`, updateData, {
        withCredentials: true,
      });
      setUpdateMsg("Student details updated successfully");
    } catch (error) {
      setUpdateError(
        error.response?.data?.message || "Updation of student info failed!",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setError("");
    setMsg("");
    setUpdateError("");
    setUpdateMsg("");

    if (!deleteRollNum) return;

    setLoading(true);
    try {
      const res = await api.delete(`/admin/students/delete/${deleteRollNum}`, {
        withCredentials: true,
      });
      setMsg("Student deleted successfully");
    } catch (err) {
      setMsg("");
      setError(err.response?.data?.message || "Error while deleting student");
    } finally {
      setLoading(false);
    }
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
                value={rollNum}
                onChange={(e) => setRollNum(e.target.value)}
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
              {updateMsg && (
                <Typography color="primary" sx={{ mt: 2 }}>
                  {updateMsg}
                </Typography>
              )}
              {updateError && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {updateError}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* DELETE CARD */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              border: "1px solid",
              borderColor: "error.light",
              minHeight: 320,
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
                value={deleteRollNum}
                onChange={(e) => setDeleteRollNum(e.target.value)}
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
              {msg && (
                <Typography color="primary" sx={{ mt: 2 }}>
                  {msg}
                </Typography>
              )}
              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
