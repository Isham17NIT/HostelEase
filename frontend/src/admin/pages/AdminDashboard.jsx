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
  Alert
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import HotelIcon from "@mui/icons-material/Hotel";
import ReportIcon from "@mui/icons-material/Report";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { useState, useEffect } from "react";
import api from "../../api/axiosInstance";

export default function AdminDashboard() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [stats, setStats] = useState([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState("");
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState("");
  const [activities, setActivities] = useState([])

  const iconMap = {
    people: <PeopleIcon />,
    event: <EventIcon />,
    hotel: <HotelIcon />,
    report: <ReportIcon />,
    currency: <CurrencyRupeeIcon />,
  };

  const getStats = async () => {
    setStatsError("");
    setStatsLoading(true);
    try {
      const res = await api.get("/admin/dashboard/stats", { withCredentials: true });
      
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

  const getActivities = async()=>{
    setActivityError("");
    setActivityLoading(true);
    try {
      const res = await api.get("/admin/dashboard/activity", { withCredentials: true });

      setActivities(res); // TODO : fix

    } catch (error) {
      setActivityError(
        error.response?.data?.message || "Error while fetching recent activity",
      );
      setActivities([]);
    } finally {
      setActivityLoading(false);
    }
  }

  useEffect(() => {
    getStats();
    getActivities();
  }, []);

  // TODO : fix rendering
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

      {/* STATS CARDS */}
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

      {/* RECENT ACTIVITY */}
      <Box mt={5}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Recent Activity
        </Typography>
        
        <Card
          sx={{
            borderRadius: 3,
            bgcolor: isDark ? "#020617" : "#ffffff",
            boxShadow: isDark ? "none" : "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <CardContent>
            <Stack spacing={2}>
              {activities.map((activity)=>(
                <ActivityItem
                text={`${activity.type} ${activity.desc} ${activity.studentID}`}
                label={activity.label}
                color={activity.color}
              />
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

function ActivityItem({ text, label, color }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography>{text}</Typography>
      <Chip label={label} color={color} size="small" />
    </Stack>
  );
}
