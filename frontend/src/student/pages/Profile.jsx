import { Card, CardContent, Typography, Avatar, Box } from "@mui/material";

export default function Profile() {
  return (
    <Card sx={{ maxWidth: 400 }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar sx={{ mr: 2 }}>R</Avatar>
          <Typography variant="h6">Rahul Sharma</Typography>
        </Box>

        <Typography variant="body2">Roll No: 21CS3045</Typography>
        <Typography variant="body2">Hostel: H-03</Typography>
        <Typography variant="body2">Phone: +91 98765 43210</Typography>
      </CardContent>
    </Card>
  );
}
