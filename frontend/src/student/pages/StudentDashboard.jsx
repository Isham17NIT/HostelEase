import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  useTheme,
  CircularProgress,
  useMediaQuery,
  Alert,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";

import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

import IconButton from "@mui/material/IconButton";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { useState, useEffect } from "react";
import api from "../../api/axiosInstance";

export default function StudentDashboard() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [stats, setStats] = useState([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState("");


  const isMobile = useMediaQuery("(max-width:768px)");

  const iconMap = {
    info: <InfoIcon/>,
    check_circle: <CheckCircleIcon />,
    calendar_month: <CalendarMonthIcon />,
    beach_access: <BeachAccessIcon />,
    hourglass_empty: <HourglassEmptyIcon />
  };

  const getStats = async () => {
    setStatsError("");
    setStatsLoading(true);
    try {
      const res = await api.get("/student/dashboard/stats", {
        withCredentials: true,
      });

      const statsWithIcons = (res.data?.data || []).map((item) => ({
        ...item,
        icon: iconMap[item.iconKey] || null,
      }));

      setStats(statsWithIcons);
    } catch (error) {
      setStatsError(
        error.response?.data?.message || "Error while fetching dashboard stats",
      );
      setStats([]);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    getStats();
  }, []);

  if (statsLoading) {
    return (
      <Box py={6} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }
  if (statsError) {
    return (
      <Alert severity="statsError" sx={{ mb: 2 }}>
        {statsError}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {stats.map((item) => (
          <Grid item xs={12} sm={6} lg={3} key={item.title}>
            <Card
              sx={{
                borderRadius: 3,
                bgcolor: isDark ? "#020617" : "#ffffff",
                boxShadow: isDark ? "none" : "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              <CardContent>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: isDark ? "gray" : "text.secondary" }}
                    >
                      {item.title}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {item.value}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      bgcolor: item.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    {item.icon}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
