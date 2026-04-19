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
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useState, useEffect } from "react";
import api from "../../api/axiosInstance";

export default function LeaveApprovals() {
  const isMobile = useMediaQuery("(max-width:768px)");

  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [limit, setLimit] = useState(isMobile ? 3 : 5);
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getPendingLeaves = async (pageNum = 1, limit = isMobile ? 3 : 5) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/leaves/pending", {
        params: { limit: isMobile ? 3 : 5, page: pageNum },
        withCredentials: true,
      });

      setLeaves(res.data?.data?.results || []);
      setPageNum(res.data?.data?.page || pageNum);
      setTotalPages(res.data?.data?.totalPages || 1);
      setLimit(res.data?.data?.limit || (isMobile ? 3 : 5));
    } catch (error) {
      setLeaves([]);
      setError(error.response?.data?.message || "Error while fetching leaves");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus, studentID) => {
    setError("");
    setLoading(true);
    try {
      const res = await api.patch(
        `/admin/leaves/${id}`,
        { newStatus, studentID },
        { withCredentials: true },
      );
      await getPendingLeaves(pageNum);
    } catch (error) {
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
    getPendingLeaves(pageNum, limit);
  }, [pageNum, limit, isMobile]);

  useEffect(() => {
    setLimit(isMobile ? 3 : 5);
  }, [isMobile]);

  const getStatusChip = (status) => {
    if (status === "APPROVED") return "success";
    if (status === "REJECTED") return "error";
    return "warning";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return dateString.split("T")[0];
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
                        onClick={() =>
                          updateStatus(row._id, "APPROVED", row.studentID)
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() =>
                          updateStatus(row._id, "REJECTED", row.studentID)
                        }
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))}
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={totalPages}
              page={pageNum}
              onChange={(e, value) => setPageNum(value)}
              color="primary"
            />
          </Box>
          {/* Limit Selector */}
          <Box mb={2} ml={2} display="flex" alignItems="center" gap={2}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="limit-label">Rows Per Page</InputLabel>
              <Select
                labelId="limit-label"
                id="limit-select"
                value={limit}
                label="Per Page"
                onChange={(e) => {
                  setLimit(e.target.value);
                  setPageNum(1); // Reset to first page when limit changes
                }}
              >
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={5}>5</MenuItem>
              </Select>
            </FormControl>
          </Box>
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
                              onClick={() =>
                                updateStatus(row._id, "APPROVED", row.studentID)
                              }
                            >
                              APPROVE
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() =>
                                updateStatus(row._id, "REJECTED", row.studentID)
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
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={totalPages}
              page={pageNum}
              onChange={(e, value) => setPageNum(value)}
              color="primary"
            />
          </Box>
          {/* Limit Selector */}
          <Box mb={2} ml={2} display="flex" alignItems="center" gap={2}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="limit-label">Rows Per Page</InputLabel>
              <Select
                labelId="limit-label"
                id="limit-select"
                value={limit}
                label="Per Page"
                onChange={(e) => {
                  setLimit(e.target.value);
                  setPageNum(1); // Reset to first page when limit changes
                }}
              >
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={5}>5</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Card>
      )}
    </Box>
  );
}
