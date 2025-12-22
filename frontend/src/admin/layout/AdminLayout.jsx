import { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";
import { Outlet } from "react-router-dom";


export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(prev => !prev);
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* MOBILE NAVBAR */}
      <AdminNavbar onMenuClick={handleDrawerToggle} />

      {/* SIDEBAR */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { md: "240px" }, // sidebar width
        }}
      >
        {/* Push content below AppBar on mobile */}
        <Toolbar sx={{ display: { xs: "block", md: "none" } }} />

        {/* to render child routes: */}
        <Outlet/> 
      </Box>
    </Box>
  );
}
