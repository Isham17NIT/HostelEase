import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Divider,
  Stack,
} from "@mui/material";
import { useState } from "react";

export default function ManageRooms() {
  // Check availability state
  const [hostel, setHostel] = useState("");
  const [roomNum, setRoomNum] = useState("");

  // Add room state
  const [newRoomNum, setNewRoomNum] = useState("");
  const [status, setStatus] = useState("VACANT");

  const handleCheckAvailability = () => {
    console.log("Check:", hostel, roomNum);
  };

  const handleAddRoom = () => {
    console.log("Add:", newRoomNum, status);
  };

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3 },
        maxWidth: "1200px",
        mx: "auto",
      }}
    >
      {/* Page Title */}
      <Typography
        variant="h5"
        fontWeight="bold"
        mb={3}
        textAlign={{ xs: "center", sm: "left" }}
      >
        Manage Rooms
      </Typography>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {/* ================= CHECK AVAILABILITY ================= */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Check Room Availability
              </Typography>

              <Stack spacing={2}>

                <TextField
                  required
                  label="Room Number"
                  type="text"
                  fullWidth
                  value={roomNum}
                  onChange={(e) => setRoomNum(e.target.value)}
                />

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleCheckAvailability}
                >
                  Check Availability
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* ================= ADD ROOM ================= */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Add Room
              </Typography>

              <Stack spacing={2}>
                <TextField
                  label="Room Number"
                  type="text"
                  fullWidth
                  value={newRoomNum}
                  required
                  onChange={(e) => setNewRoomNum(e.target.value)}
                />

                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  fullWidth
                  onClick={handleAddRoom}
                >
                  Add Room
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

    </Box>
  );
}
