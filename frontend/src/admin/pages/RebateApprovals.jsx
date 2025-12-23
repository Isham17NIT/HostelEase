import { useState } from "react";
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

const STATUS_COLORS = {
  PENDING: "warning",
  APPROVED: "success",
};

const initialRebates = [
  {
    _id: "RBT001",
    createdAt: "2025-01-10",
    rollNum: "CS23B001",
    fromDate: "2025-01-10",
    dateOfJoining: "2025-01-15",
    numDays: 5,
    status: "PENDING",
  },
  {
    _id: "RBT002",
    createdAt: "2025-01-12",
    rollNum: "CS23B045",
    fromDate: "2025-01-10",
    dateOfJoining: "2025-01-20",
    numDays: 10,
    status: "PENDING",
  },
];

export default function ManageRebates() {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [rebates, setRebates] = useState(initialRebates);

  const updateStatus = (id, newStatus) => {
    setRebates((prev) =>
      prev.map((r) =>
        r._id === id ? { ...r, status: newStatus } : r
      )
    );
  };

  return (
    <Box p={2}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Rebates
      </Typography>

      {/* 📱 MOBILE VIEW */}
      {isMobile ? (
        <Stack spacing={2}>
          {rebates.map((r) => (
            <Card key={r._id}>
              <CardContent>
                <Typography fontWeight="bold">
                  {r._id}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Roll No: {r.rollNum}
                </Typography>

                <Typography mt={1}>
                  From <b>{r.fromDate}</b>
                </Typography>

                <Typography mt={1}>
                  Date of Joining <b>{r.dateOfJoining}</b>
                </Typography>

                <Typography variant="body2" mt={1}>
                  Total Days: <b>{r.numDays}</b>
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  mt={1}
                >
                  Applied on {r.createdAt}
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  mt={2}
                  alignItems="center"
                >
                  <Chip
                    label={r.status}
                    color={STATUS_COLORS[r.status]}
                    size="small"
                  />

                  {r.status !== "APPROVED" ? (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        updateStatus(r._id, "APPROVED")
                      }
                    >
                      Approve
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      color="warning"
                      onClick={() =>
                        updateStatus(r._id, "PENDING")
                      }
                    >
                      Revoke
                    </Button>
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
                    <TableCell><b>Joining Date</b></TableCell>
                    <TableCell><b>No. of Days</b></TableCell>
                    <TableCell><b>Status</b></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {rebates.map((r) => (
                    <TableRow key={r._id} hover>
                      <TableCell>{r.createdAt}</TableCell>
                      <TableCell>{r.rollNum}</TableCell>
                      <TableCell>{r.fromDate}</TableCell>
                      <TableCell>{r.dateOfJoining}</TableCell>
                      <TableCell>{r.numDays}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Chip
                            label={r.status}
                            color={STATUS_COLORS[r.status]}
                            size="small"
                          />
                          {r.status !== "APPROVED" && (
                            <Button
                              size="small"
                              onClick={() =>
                                updateStatus(r._id, "APPROVED")
                              }
                            >
                              Approve
                            </Button>
                          )}
                        </Stack>
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
