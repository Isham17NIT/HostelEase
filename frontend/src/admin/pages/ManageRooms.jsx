import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Stack,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import api from "../../api/axiosInstance.js";

export default function ManageRooms() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [roomNum, setRoomNum] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleCheckAvailability = async () => {
    setMsg("");
    setError("");

    if (!roomNum) {
      return;
    }

    setLoading(true);

    // backend api call
    try {
      const response = await api.post(
        "admin/rooms/check-availability",
        {
          roomNum,
        },
        { withCredentials: true },
      );

      const roomStatus = response.data.data.status;
      setMsg(`Room is ${roomStatus}`);
    } catch (error) {
      setMsg("");
      setError(error.response?.data?.message || "Room Check failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = async () => {
    setMsg("");
    setError("");

    if (!roomNum) {
      return;
    }

    setLoading(true);

    //backend api call
    try {
      const response = await api.post(
        "/admin/rooms/add",
        {
          roomNum,
        },
        { withCredentials: true },
      );
      setMsg("Room added successfully");
    } catch (error) {
      setMsg("");
      setError(error.response?.data?.message || "Add room failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{ width: "100%", display: "flex", justifyContent: "center", p: 2 }}
    >
      <Card
        sx={{
          boxShadow: 3,
          borderRadius: 3,
          width: "100%",
          maxWidth: 400,
          p: 1,
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            fontWeight="bold"
            mb={1}
            textAlign={{ xs: "center", sm: "left" }}
          >
            Room Actions
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Check room status or create a new room.
          </Typography>

          <Stack spacing={3}>
            <TextField
              required
              pt={3}
              label="Room Number"
              fullWidth
              value={roomNum}
              onChange={(e) => {
                setRoomNum(e.target.value);
                setMsg("");
                setError("");
              }}
            />

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              justifyContent="center"
            >
              <Grid item xs={12} sm={6}>
                <Button
                  size="large"
                  fullWidth
                  sx={{
                    bgcolor: isDark ? "#1e40af" : "#2563eb",
                    color: "white",
                    "&:hover": {
                      bgcolor: isDark ? "#1d4ed8" : "#1d4ed8",
                    },
                  }}
                  onClick={handleCheckAvailability}
                  disabled={loading}
                >
                  Check Availability
                </Button>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Button
                  size="large"
                  fullWidth
                  sx={{
                    bgcolor: isDark ? "#15803d" : "#16a34a",
                    color: "white",
                    "&:hover": {
                      bgcolor: isDark ? "#16a34a" : "#15803d",
                    },
                  }}
                  onClick={handleAddRoom}
                  disabled={loading}
                >
                  Add Room
                </Button>
              </Grid>
            </Stack>
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
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
