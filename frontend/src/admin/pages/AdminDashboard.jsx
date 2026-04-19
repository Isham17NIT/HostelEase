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
  Pagination
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
  const [activities, setActivities] = useState([]);

  const isMobile = useMediaQuery("(max-width:768px)");

  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

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
      const res = await api.get("/admin/dashboard/stats", {
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

  const getActivities = async (pageNum = 1) => {
    setActivityError("");
    setActivityLoading(true);
    try {
      const res = await api.get("/admin/dashboard/activity", {
        params: { limit: isMobile ? 5 : 10, page: pageNum },
        withCredentials: true,
      });

      setActivities(res.data?.data?.results || []);
      setTotalPages(res.data?.data?.totalPages || 1);
      setTotalCount(res.data?.data?.totalResults || 0);
      setPageNum(res.data?.data?.pageNum || pageNum);

    } catch (error) {
      setActivityError(
        error.response?.data?.message || "Error while fetching recent activity",
      );
      setActivities([]);
    } finally {
      setActivityLoading(false);
    }
  };

  useEffect(() => {
    getStats();
  }, []);

  useEffect(() => {
    getActivities(pageNum);
  }, [pageNum]);

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
            minHeight: '400px'
          }}
        >
          <CardContent>
            <Stack spacing={2}>
              {activities.map((activity) => (
                <Typography key={activity._id}>
                  {`${activity.type} ${activity.desc}${activity.studentID ? activity.studentID : ""}`}
                </Typography>
              ))}
            </Stack>
          </CardContent>
        </Card>
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={pageNum}
            onChange={(e, value) => setPageNum(value)}
            color="primary"
          />
        </Box>
      </Box>
    </Box>
  );
}
