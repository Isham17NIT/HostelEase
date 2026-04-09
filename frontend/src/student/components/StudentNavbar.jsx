import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function StudentNavbar({ onMenuClick }) {
  return (
    <AppBar
      position="fixed"
      sx={{
        display: { xs: "block", md: "none" }, // MOBILE ONLY
        pt: 1, pb: 1
      }}
    >
      <Toolbar>
        {/* MENU BUTTON */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        {/* TITLE */}
        <Box>
          <Typography variant="h6" fontWeight="bold" lineHeight={1.2}>
            HostelEase
          </Typography>
          <Typography variant="caption">
            Student Portal
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
