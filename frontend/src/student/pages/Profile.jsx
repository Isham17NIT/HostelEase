import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useState } from "react";

export default function Profile() {
  const [open, setOpen] = useState(false);

  const userInfo = {
    name: "Isham",
    rollNum: 123123231,
    roomNum: 103,
    phoneNum: "1234567890",
    address: "Street XYZ, ABC City, Country",
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    // TODO: call API here
    console.log("Password change submitted");
    handleClose();
  };

  return (
    <>
      <Card sx={{ maxWidth: 400 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar sx={{ mr: 2 }}>{userInfo.name[0]}</Avatar>
            <Typography variant="h6">{userInfo.name}</Typography>
          </Box>

          <Typography variant="body2">Roll No.: {userInfo.rollNum}</Typography>
          <Typography variant="body2">Hostel: {userInfo.hostel}</Typography>
          <Typography variant="body2">Room No.: {userInfo.roomNum}</Typography>
          <Typography variant="body2">Phone: {userInfo.phoneNum}</Typography>
          <Typography variant="body2">
            Home Address: {userInfo.address}
          </Typography>

          {/* 🔑 Change Password Link */}
          <Box sx={{ mt: 2, textAlign: "right" }}>
            <Link
              component="button"
              underline="hover"
              sx={{ fontSize: "0.85rem", fontWeight: 500 }}
              onClick={handleOpen}
            >
              Change Password
            </Link>
          </Box>
        </CardContent>
      </Card>

      {/* 🔐 CHANGE PASSWORD POPUP */}
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Change Password</DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Current Password"
            type="password"
            size="small"
            fullWidth
            sx={{mt:1}}
            required
          />
          <TextField
            label="New Password"
            type="password"
            size="small"
            fullWidth
            required
          />
          <TextField
            label="Confirm New Password"
            type="password"
            size="small"
            fullWidth
            required
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
