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

export default function ManageRooms() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [roomNum, setRoomNum] = useState("");

  const handleCheckAvailability = () => {
    if (!roomNum) {
      alert("Please enter a room number");
      return;
    }
    console.log("Check availability for room:", roomNum);
  };

  const handleAddRoom = () => {
    if (!roomNum) {
      alert("Please enter a room number");
      return;
    }
    console.log("Add room:", roomNum);
  };

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3 },
        maxWidth: "800px",
        mx: "auto",
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        mb={3}
        textAlign={{ xs: "center", sm: "left" }}
      >
        Manage Rooms
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Room Actions
          </Typography>

          <Stack spacing={3}>
            <TextField
              required
              label="Room Number"
              fullWidth
              value={roomNum}
              onChange={(e) => setRoomNum(e.target.value)}
            />

            <Grid container spacing={2}>
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
                >
                  Add Room
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
