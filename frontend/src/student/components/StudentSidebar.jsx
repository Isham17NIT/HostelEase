import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Switch,
} from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import NoMealsIcon from '@mui/icons-material/NoMeals';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { NavLink, useLocation } from "react-router-dom";
import { useEffect } from "react";

import { logout } from "../../utils/logout.jsx";
import { useThemeMode } from "../../app/ThemeContext";

const drawerWidth = 240;

export default function StudentSidebar({ mobileOpen, onClose }) {
  const { mode, toggleTheme } = useThemeMode();
  const location = useLocation();

  // Auto-close drawer on route change or theme change(mobile only)
  useEffect(() => {
    if (mobileOpen && onClose) {
      onClose();
    }
  }, [location.pathname, mode]);

  const drawerContent = (
    <>
      {/* HEADER */}
      <Box sx={{ p: 2, display:"flex", flexDirection: "column", alignItems:"center", justifyContent:"space-evenly"}}>
        <Typography variant="h6" fontWeight="bold">
          HostelHub
        </Typography>
        <Typography variant="caption">Student Portal</Typography>
      </Box>

      <Divider />

      {/* MENU */}
      <List>
        <ListItemButton component={NavLink} to="/student" sx={{display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <ListItemIcon sx={{ minWidth: 50, color: "text.primary" }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton component={NavLink} to="/student/leave">
          <ListItemIcon sx={{ minWidth: 50, color: "text.primary" }}>
            <CalendarMonthIcon />
          </ListItemIcon>
          <ListItemText primary="Apply Leave" />
        </ListItemButton>

        <ListItemButton component={NavLink} to="/student/rebate">
          <ListItemIcon sx={{ minWidth: 50, color: "text.primary" }}>
            <NoMealsIcon/>
          </ListItemIcon>
          <ListItemText primary="Apply Rebate" />
        </ListItemButton>

        <ListItemButton component={NavLink} to="/student/complaints">
          <ListItemIcon sx={{ minWidth: 50, color: "text.primary" }}>
            <SaveAsIcon/>
          </ListItemIcon>
          <ListItemText primary="Complaints" />
        </ListItemButton>

        <ListItemButton component={NavLink} to="/student/profile">
          <ListItemIcon sx={{ minWidth: 50, color: "text.primary" }}>
            <PersonIcon/>
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItemButton>
      </List>

      {/* <Divider /> */}

      <Box sx={{ flexGrow: 1 }} />

      {/* THEME TOGGLE */}
      <Box
        sx={{
          px: 2,
          py: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ListItemText primary="Change Theme" sx={{ml:0}}/>
        </Box>
        <Switch checked={mode === "dark"} onChange={toggleTheme} />
      </Box>

      <Divider />

      {/* LOGOUT */}
      <List>
        <ListItemButton onClick={logout} component={NavLink} to="/login">
          <ListItemIcon sx={{ minWidth: 50, color: "text.primary" }}>
            <LogoutIcon/>
          </ListItemIcon>
          <ListItemText primary="Sign Out" />
        </ListItemButton>
      </List>
    </>
  );

  return (
    <>
      {/* MOBILE DRAWER */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          [`& .MuiDrawer-paper`]: { width: drawerWidth },
          height: "100vh"
        }}
      >
        {drawerContent}
      </Drawer>

      {/* DESKTOP DRAWER */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          [`& .MuiDrawer-paper`]: { width: drawerWidth },
          height: "100vh"
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
