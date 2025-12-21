import { Box, Button, TextField, Typography } from "@mui/material";
import { useThemeMode } from "../../app/ThemeContext";

export default function ApplyLeave() {
  const {mode, toggleTheme } = useThemeMode()
  return (
    <Box maxWidth={500}>
      <Typography variant="h5" gutterBottom>
        Apply Leave
      </Typography>

      <TextField
        fullWidth
        label="Leave From"
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
        label="Date of Return"
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

      <TextField fullWidth label="Leave Address" margin="normal" required/>
      <TextField fullWidth label="Leave Purpose" margin="normal" required/>


      <Button variant="contained" sx={{ mt: 2 }}>
        Submit
      </Button>
    </Box>
  );
}
