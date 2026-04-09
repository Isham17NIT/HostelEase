import { useState, useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import api from "../../api/axiosInstance";

const STATUS_COLORS = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "error",
};

export default function ManageRebates() {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [rebates, setRebates] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return dateString.split("T")[0];
  };

  const getPendingRebates = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/rebates/pending", {
        withCredentials: true,
      });
      setRebates(res.data?.data || []);
    } catch (error) {
      setRebates([]); // Ensures rebates is always an array
      setError(
        error.response?.data?.message ||
          "Error while fetching pending complaints",
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus, studentID) => {
    setError("");
    setLoading(true);
    try {
      const res = await api.patch(
        `/admin/rebates/${id}`,
        { newStatus, studentID },
        { withCredentials: true },
      );

      await getPendingRebates();
    } catch (error) {
      setError(
        error.response?.data?.message || "error while updating rebate status",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPendingRebates();
  }, []);

  return (
    <Box p={2}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Rebates
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
      ) : rebates.length === 0 ? (
        <Alert severity="info">No pending rebates found</Alert>
      ) : isMobile ? (
        <Stack spacing={2}>
          {rebates.map((r) => (
            <Card key={r._id}>
              <CardContent>
                <Typography fontWeight="bold">{r._id}</Typography>

                <Typography variant="body2" color="text.secondary">
                  StudentID: {r.studentID}
                </Typography>

                <Typography mt={1}>
                  From <b>{formatDate(r.fromDate)}</b>
                </Typography>

                <Typography mt={1}>
                  To <b>{formatDate(r.toDate)}</b>
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
                  Applied on {formatDate(r.createdAt)}
                </Typography>

                <Stack direction="row" spacing={1} mt={2} alignItems="center">
                  <Chip
                    label={r.status}
                    color={STATUS_COLORS[r.status]}
                    size="small"
                  />
                  {r.status === "PENDING" && (
                    <>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => updateStatus(r._id, "APPROVED", r.studentID)}
                      >
                        Approve
                      </Button>

                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => updateStatus(r._id, "REJECTED", r.studentID)}
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
                      <b>From</b>
                    </TableCell>
                    <TableCell>
                      <b>To</b>
                    </TableCell>
                    <TableCell>
                      <b>Total Days</b>
                    </TableCell>
                    <TableCell>
                      <b>Status</b>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {rebates.map((r) => (
                    <TableRow key={r._id} hover>
                      <TableCell>{formatDate(r.createdAt)}</TableCell>
                      <TableCell>{r.studentID}</TableCell>
                      <TableCell>{formatDate(r.fromDate)}</TableCell>
                      <TableCell>{formatDate(r.toDate)}</TableCell>
                      <TableCell>{r.numDays}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Chip
                            label={r.status}
                            color={STATUS_COLORS[r.status]}
                            size="small"
                          />
                          {r.status === "PENDING" && (
                            <>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => updateStatus(r._id, "APPROVED", r.studentID)}
                              >
                                Approve
                              </Button>

                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => updateStatus(r._id, "REJECTED", r.studentID)}
                              >
                                Reject
                              </Button>
                            </>
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
