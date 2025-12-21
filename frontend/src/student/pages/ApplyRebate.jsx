import { Box, Button, TextField, Typography } from "@mui/material";
import { useThemeMode } from "../../app/ThemeContext";

export default function ApplyRebate() {
  const {mode, toggleTheme } = useThemeMode()
  return (
    <Box maxWidth={500}>
      <Typography variant="h5" gutterBottom>
        Apply Rebate
      </Typography>

      <TextField
        fullWidth
        label="Rebate From"
        type="date"
        margin="normal"
        InputLabelProps={{ shrink: true }}
        sx={{
          "& input::-webkit-calendar-picker-indicator": {
            filter: mode === "dark" ? "invert(1)" : "none",
          },
        }}
        required
      />

      <TextField
        fullWidth
        label="Date of Joining"
        type="date"
        margin="normal"
        InputLabelProps={{ shrink: true }}
        sx={{
          "& input::-webkit-calendar-picker-indicator": {
            filter: mode === "dark" ? "invert(1)" : "none",
          },
        }}
        required
      />

      <Button variant="contained" sx={{ mt: 2 }}>
        Submit
      </Button>
    </Box>
  );
}
