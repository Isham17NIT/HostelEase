import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  useTheme,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import HotelIcon from "@mui/icons-material/Hotel";
import ReportIcon from "@mui/icons-material/Report";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

export default function AdminDashboard() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const stats = [
    {
      title: "Total Students",
      value: 320,
      icon: <PeopleIcon />,
      color: "#2563eb",
    },
    {
      title: "Pending Leaves",
      value: 12,
      icon: <EventIcon />,
      color: "#f59e0b",
    },
    {
      title: "Available Rooms",
      value: 18,
      icon: <HotelIcon />,
      color: "#22c55e",
    },
    {
      title: "Pending Rebates",
      value: 5,
      icon: <CurrencyRupeeIcon />,
      color: "#0ea5e9",
    },
    {
      title: "Open Complaints",
      value: 7,
      icon: <ReportIcon />,
      color: "#ef4444",
    },
  ];

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
                boxShadow: isDark
                  ? "none"
                  : "0 4px 20px rgba(0,0,0,0.08)",
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
            boxShadow: isDark
              ? "none"
              : "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <CardContent>
            <Stack spacing={2}>
              <ActivityItem
                text="Leave approved for CS23B001"
                label="Leaves"
                color="success"
              />
              <ActivityItem
                text="New student added: CS23B120"
                label="Students"
                color="info"
              />
              <ActivityItem
                text="Rebate approved for CS23B045"
                label="Rebates"
                color="primary"
              />
              <ActivityItem
                text="Complaint resolved for Room 203"
                label="Complaints"
                color="warning"
              />
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

function ActivityItem({ text, label, color }) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Typography>{text}</Typography>
      <Chip label={label} color={color} size="small" />
    </Stack>
  );
}
