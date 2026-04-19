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
  Pagination, FormControl,
  InputLabel, Select, MenuItem,
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

  const [limit, setLimit] = useState(isMobile ? 3 : 5);
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return dateString.split("T")[0];
  };

  const getPendingRebates = async (pageNum = 1, limit = isMobile ? 3 : 5) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/rebates/pending", {
        params: { limit: limit, page: pageNum },
        withCredentials: true,
      });

      setRebates(res.data?.data?.results || []);
      setPageNum(res.data?.data?.page || pageNum);
      setTotalPages(res.data?.data?.totalPages || 1);
      setLimit(res.data?.data?.limit || (isMobile ? 3 : 5));

    } catch (error) {
      setRebates([]); 
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

      await getPendingRebates(pageNum, limit);
    } catch (error) {
      setError(
        error.response?.data?.message || "error while updating rebate status",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPendingRebates(pageNum, limit);
  }, [pageNum, limit, isMobile]);

  useEffect(()=>{
    setLimit(isMobile ? 3 : 5)
  }, [isMobile]);

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
                        variant="contained"
                        color="success"
                        onClick={() =>
                          updateStatus(r._id, "APPROVED", r.studentID)
                        }
                      >
                        Approve
                      </Button>

                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() =>
                          updateStatus(r._id, "REJECTED", r.studentID)
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
                                variant="contained"
                                color="success"
                                onClick={() =>
                                  updateStatus(r._id, "APPROVED", r.studentID)
                                }
                              >
                                Approve
                              </Button>

                              <Button
                                size="small"
                                variant="contained"
                                color="error"
                                onClick={() =>
                                  updateStatus(r._id, "REJECTED", r.studentID)
                                }
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
                <MenuItem value={10}>10</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Card>
      )}
    </Box>
  );
}
