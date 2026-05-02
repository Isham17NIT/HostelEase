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
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import HotelIcon from "@mui/icons-material/Hotel";
import ReportIcon from "@mui/icons-material/Report";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
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

  const [limit, setLimit] = useState(isMobile ? 3 : 5);
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  const getActivities = async (pageNum = 1, limit = isMobile ? 3 : 5) => {
    setActivityError("");
    setActivityLoading(true);
    try {
      const res = await api.get("/admin/dashboard/activity", {
        params: { limit, page: pageNum },
        withCredentials: true,
      });

      setActivities(res.data?.data?.results || []);
      setTotalPages(res.data?.data?.totalPages || 1);
      setPageNum(res.data?.data?.page || pageNum);
      setLimit(res.data?.data?.limit || (isMobile ? 3 : 5));
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
    getActivities(pageNum, limit);
  }, [pageNum, limit, isMobile]);

  useEffect(() => {
    setLimit(isMobile ? 3 : 5);
  }, [isMobile]);

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
            minHeight: "300px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardContent sx={{ flexGrow: 1 }}>
            <Stack spacing={2}>
              {activities.map((activity) => (
                <Typography key={activity._id}>
                  {`${activity.type} ${activity.desc}${activity.studentID ? activity.studentID : ""}`}
                </Typography>
              ))}
            </Stack>
          </CardContent>
          <Box
            sx={{
              px: 3,
              py: 2,
              borderTop: "1px solid #e5e7eb",
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              {!isMobile && (<Typography variant="body2" color="text.secondary">
                Rows per page
              </Typography>)}
              
              <FormControl size="small" sx={{ minWidth: 90 }}>
                <Select
                  value={limit}
                  onChange={(e) => {
                    setLimit(e.target.value);
                    setPageNum(1);
                  }}
                >
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap={1}
            >
              <IconButton
                onClick={() => setPageNum((prev) => prev - 1)}
                disabled={pageNum === 1}
              >
                <KeyboardArrowLeft />
              </IconButton>
              <Typography
                sx={{
                  minWidth: 32,
                  textAlign: "center",
                  fontWeight: 600,
                }}
              >
                {pageNum}
              </Typography>

              <IconButton
                onClick={() => setPageNum((prev) => prev + 1)}
                disabled={pageNum === totalPages}
              >
                <KeyboardArrowRight />
              </IconButton>
            </Box>
            <Box />
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
