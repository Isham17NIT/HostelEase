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
  Alert,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect, useContext } from "react";

// Helper to delay execution
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

import api from "../../api/axiosInstance";
import { logout } from "../../utils/logout";
import { UserContext } from "../../app/UserContext";

export default function Profile() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [userInfo, setUserInfo] = useState({
    name: "",
    rollNum: "",
    roomNum: "",
    phoneNum: "",
    address: "",
  });

  const { setUser } = useContext(UserContext);

  const fetchUserInfo = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await api.get("/student/getProfile", {
        withCredentials: true,
      });
      if (res.data?.success) {
        const studentInfo = res.data.data;
        setUserInfo({
          name: studentInfo.name,
          rollNum: studentInfo.rollNum,
          roomNum: studentInfo.roomNum,
          phoneNum: studentInfo.phoneNum,
          address: studentInfo.address,
        });
      } else setError("Error while fetching profile info");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Error occurred while fetching profile info",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await api.post(
        "/student/changePassword",
        { newPassword: formData.password },
        { withCredentials: true },
      );
      if (res.data?.success) {
        setSuccess("Password changed successfully");
        setFormData({
          password: "",
          confirmPassword: "",
        });
        handleClose();
        await delay(1500);
        await logout(setUser);
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Error while changing password",
      );
    } finally {
      setLoading(false);
    }
    handleClose();
  };

  return (
    <>
      {loading ? (
        <Box py={6} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : (
        <>
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          <Card sx={{ maxWidth: 400 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ mr: 2 }}>{userInfo.name[0]}</Avatar>
                <Typography variant="h6">{userInfo.name}</Typography>
              </Box>

              <Typography variant="body2">
                Roll No.: {userInfo.rollNum}
              </Typography>
              <Typography variant="body2">
                Room No.: {userInfo.roomNum}
              </Typography>
              <Typography variant="body2">
                Phone: {userInfo.phoneNum}
              </Typography>
              <Typography variant="body2">
                Home Address: {userInfo.address}
              </Typography>

              {/* CHANGE PASSWORD LINK */}
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
          {/* CHANGE PASSWORD POPUP */}
          <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle>Change Password</DialogTitle>

            <DialogContent
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                label="New Password"
                type="password"
                size="small"
                fullWidth
                required
                name="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, password: e.target.value }))
                }
              />
              <TextField
                label="Confirm New Password"
                type="password"
                size="small"
                fullWidth
                required
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData((f) => ({
                    ...f,
                    confirmPassword: e.target.value,
                  }))
                }
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
      )}
    </>
  );
}
