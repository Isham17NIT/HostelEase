import { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import StudentNavbar from "../components/StudentNavbar";
import StudentSidebar from "../components/StudentSidebar";
import { Outlet } from "react-router-dom";


export default function StudentLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(prev => !prev);
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* MOBILE NAVBAR */}
      <StudentNavbar onMenuClick={handleDrawerToggle} />

      {/* SIDEBAR */}
      <StudentSidebar
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
