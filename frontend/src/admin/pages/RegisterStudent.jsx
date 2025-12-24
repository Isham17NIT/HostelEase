import { Box, Button, TextField, Typography } from "@mui/material";
import { useThemeMode } from "../../app/ThemeContext";

export default function RegisterStudent() {
  const {mode, toggleTheme } = useThemeMode()
  const fields=[
    {title: "Roll Number", type:"text"},
    {title: "Student Name", type:"text"},
    {title: "Father's Name", type:"text"},
    {title: "Mother's Name", type:"text"},
    {title: "Father's email", type:"email"},
    {title: "Mother's email", type:"email"},
    {title: "Date of Birth", type:"date"},
    {title: "Phone Number", type:"text"},
    {title: "House Address", type:"text"}
    ]
  return (
    <Box maxWidth={500}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Add New Student
      </Typography>

      {
        fields.map((field, index)=>(
            <TextField
                key={index}
                fullWidth
                label={field.title}
                type={field.type}
                margin="normal"
                InputLabelProps={{ shrink: true }}
                sx={{
                "& input::-webkit-calendar-picker-indicator": {
                    filter: mode === "dark" ? "invert(1)" : "none",
                },
                }}
                required
            />
        ))
      }

      <Button variant="contained" sx={{ mt: 2 }}>
        ADD STUDENT
      </Button>
    </Box>
  );
}
