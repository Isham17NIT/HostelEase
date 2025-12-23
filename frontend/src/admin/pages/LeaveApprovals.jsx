import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";

const initialLeaves = [
  {
    id: 1,
    appliedOn: "2025-01-10",
    rollNo: "CS23B001",
    fromDate: "2025-01-10",
    toDate: "2025-01-15",
    days: 5,
    address: "Delhi, India",
    purpose: "Family function",
    status: "PENDING",
  },
  {
    id: 2,
    appliedOn: "2025-01-12",
    rollNo: "CS23B045",
    fromDate: "2025-01-10",
    toDate: "2025-01-20",
    days: 10,
    address: "Jaipur, Rajasthan",
    purpose: "Medical treatment",
    status: "PENDING",
  },
];

export default function LeaveApprovals() {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [leaves, setLeaves] = useState(initialLeaves);

  const updateStatus = (id, newStatus) => {
    setLeaves((prev) =>
      prev.map((leave) =>
        leave.id === id ? { ...leave, status: newStatus } : leave
      )
    );
  };

  const getStatusChip = (status) => {
    if (status === "APPROVED") return "success";
    if (status === "REJECTED") return "error";
    return "warning";
  };

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Leaves
      </Typography>

      {/* 📱 MOBILE VIEW */}
      {isMobile ? (
        <Stack spacing={2}>
          {leaves.map((row) => (
            <Card key={row.id}>
              <CardContent>
                <Typography fontWeight="bold">{row.rollNo}</Typography>

                <Typography variant="body2" color="text.secondary">
                  {row.fromDate} → {row.toDate}
                </Typography>

                <Typography variant="body2" mt={1}>
                  Applied on: {row.appliedOn}
                </Typography>

                <Typography variant="body2">
                  Days: {row.days}
                </Typography>

                <Typography variant="body2" mt={1}>
                  <b>Address:</b> {row.address}
                </Typography>

                <Typography variant="body2">
                  <b>Purpose:</b> {row.purpose}
                </Typography>

                <Stack direction="row" spacing={1} mt={2} alignItems="center">
                  <Chip
                    label={row.status}
                    color={getStatusChip(row.status)}
                    size="small"
                  />

                  {row.status === "PENDING" && (
                    <>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => updateStatus(row.id, "APPROVED")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => updateStatus(row.id, "REJECTED")}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      ) : (
        /* 💻 DESKTOP VIEW */
        <Card>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><b>Applied On</b></TableCell>
                    <TableCell><b>Roll No.</b></TableCell>
                    <TableCell><b>From Date</b></TableCell>
                    <TableCell><b>To Date</b></TableCell>
                    <TableCell><b>No. of Days</b></TableCell>
                    <TableCell><b>Leave Address</b></TableCell>
                    <TableCell><b>Purpose</b></TableCell>
                    <TableCell><b>Status</b></TableCell>
                    <TableCell align="right"><b>Action</b></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {leaves.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell>{row.appliedOn}</TableCell>
                      <TableCell>{row.rollNo}</TableCell>
                      <TableCell>{row.fromDate}</TableCell>
                      <TableCell>{row.toDate}</TableCell>
                      <TableCell>{row.days}</TableCell>
                      <TableCell>{row.address}</TableCell>
                      <TableCell>{row.purpose}</TableCell>

                      <TableCell>
                        <Chip
                          label={row.status}
                          color={getStatusChip(row.status)}
                          sx={{ fontWeight: "bold" }}
                        />
                      </TableCell>

                      <TableCell align="right">
                        {row.status === "PENDING" ? (
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="flex-end"
                          >
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              onClick={() =>
                                updateStatus(row.id, "APPROVED")
                              }
                            >
                              APPROVE
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() =>
                                updateStatus(row.id, "REJECTED")
                              }
                            >
                              REJECT
                            </Button>
                          </Stack>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            —
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
