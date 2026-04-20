import { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      {/* MOBILE NAVBAR */}
      <AdminNavbar onMenuClick={handleDrawerToggle} />

      {/* SIDEBAR */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 0,
          ml: { md: "240px" }, // sidebar width
          width: { md: `calc(100% - 240px)` }, // Force calculation of remaining width
        }}
      >
        <Toolbar sx={{ display: { xs: "block", md: "none" } }} />

        {/* <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center", // Vertical Center
            justifyContent: "center", // Horizontal Center
            p: 3,
          }}
        > */}
          <Outlet />
        {/* </Box> */}
      </Box>
    </Box>
  );
}
