import { Typography, Grid, Card, CardContent } from "@mui/material";

export default function Dashboard() {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Welcome Back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Apply Leave</Typography>
              <Typography variant="body2">
                Request hostel leave
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Apply Rebate</Typography>
              <Typography variant="body2">
                Mess fee rebate
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Complaints</Typography>
              <Typography variant="body2">
                Track hostel issues
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
