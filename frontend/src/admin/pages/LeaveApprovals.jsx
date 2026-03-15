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
  Alert,
  CircularProgress
} from "@mui/material";
import { useState, useEffect } from "react";
import api from "../../api/axiosInstance";

export default function LeaveApprovals() {
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState("");

  const getPendingLeaves = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/leaves/pending", { withCredentials: true });
      setLeaves(res.data?.data || []);
    } catch (error) {
      setLeaves([]);
      setError(error.response?.data?.message || "Error while fetching leaves");
    } finally {
      setLoading(false);
    }
  };
  const isMobile = useMediaQuery("(max-width:768px)");

  const updateStatus = async (id, newStatus) => {
    setError("");
    setLoading(true);
    try {
      const res = await api.patch(
        `/admin/leaves/${id}`,
        { newStatus },
        { withCredentials: true },
      );
      await getPendingLeaves();
    } catch (err) {
      setLeaves([]);
      setError(
        error.response?.data?.message || "Error while updating leave status",
      );
    } finally {
      setLoading(false);
    }
    const res = await api.patch(`admin/leaves/${id}`);
  };

  useEffect(() => {
    getPendingLeaves();
  }, []);

  const getStatusChip = (status) => {
    if (status === "APPROVED") return "success";
    if (status === "REJECTED") return "error";
    return "warning";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return dateString.split('T')[0];
  };

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Leaves
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box py={6} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : leaves.length === 0 ? (
        <Alert severity="info">No pending leaves found</Alert>
      ) : isMobile ? (
        <Stack spacing={2}>
          {leaves.map((row) => (
            <Card key={row._id}>
              <CardContent>
                <Typography fontWeight="bold">{row.studentID}</Typography>

                <Typography variant="body2" color="text.secondary">
                  {formatDate(row.fromDate)} → {formatDate(row.toDate)}
                </Typography>

                <Typography variant="body2" mt={1}>
                  Applied on: {formatDate(row.createdAt)}
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
                        onClick={() => updateStatus(row._id, "APPROVED")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => updateStatus(row._id, "REJECTED")}
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
        /* DESKTOP VIEW */
        <Card>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <b>Applied On</b>
                    </TableCell>
                    <TableCell>
                      <b>StudentID</b>
                    </TableCell>
                    <TableCell>
                      <b>From Date</b>
                    </TableCell>
                    <TableCell>
                      <b>To Date</b>
                    </TableCell>
                    <TableCell>
                      <b>Leave Address</b>
                    </TableCell>
                    <TableCell>
                      <b>Purpose</b>
                    </TableCell>
                    <TableCell>
                      <b>Status</b>
                    </TableCell>
                    <TableCell align="right">
                      <b>Action</b>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {leaves.map((row) => (
                    <TableRow key={row._id} hover>
                      <TableCell>{formatDate(row.createdAt)}</TableCell>
                      <TableCell>{row.studentID}</TableCell>
                      <TableCell>{formatDate(row.fromDate)}</TableCell>
                      <TableCell>{formatDate(row.toDate)}</TableCell>
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
                              onClick={() => updateStatus(row._id, "APPROVED")}
                            >
                              APPROVE
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => updateStatus(row._id, "REJECTED")}
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
