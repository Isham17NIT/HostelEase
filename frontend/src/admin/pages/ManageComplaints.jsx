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
  CircularProgress,
  Alert,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import api from "../../api/axiosInstance.js";

const STATUS_COLORS = {
  PENDING: "warning",
  RESOLVED: "success",
};

function ExpandableText({ text, lines = 2 }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 80;

  return (
    <>
      <Typography
        variant="body2"
        sx={{
          display: "-webkit-box",
          WebkitLineClamp: expanded ? "unset" : lines,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {text}
      </Typography>

      {isLong && (
        <Button
          size="small"
          sx={{ p: 0, mt: 0.5, textTransform: "none" }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Read less" : "Read more"}
        </Button>
      )}
    </>
  );
}

export default function ManageComplaints() {
  const isMobile = useMediaQuery("(max-width:768px)");

  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [limit, setLimit] = useState(isMobile ? 3 : 5);
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return dateString.split("T")[0];
  };

  const getPendingComplaints = async (
    pageNum = 1,
    limit = isMobile ? 3 : 5,
  ) => {
    setError("");
    setLoading(true);
    try {
      const response = await api.get("/admin/complaints/pending", {
        params: { limit: limit, page: pageNum },
        withCredentials: true,
      });

      setComplaints(response.data?.data?.results || []);
      setPageNum(response.data?.data?.page || pageNum);
      setTotalPages(response.data?.data?.totalPages || 1);
      setLimit(response.data?.data?.limit || (isMobile ? 3 : 5));
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Error while fetching pending complaints",
      );
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const updateComplaintStatus = async (id, studentID) => {
    setLoading(true);
    setError("");
    try {
      const response = await api.patch(
        `/admin/complaints/${id}`,
        { newStatus: "RESOLVED", studentID },
        { withCredentials: true },
      );
      await getPendingComplaints(pageNum, limit);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Error while updating complaint status",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPendingComplaints(pageNum, limit);
  }, [pageNum, limit, isMobile]);

  useEffect(()=>{
    setLimit(isMobile ? 3 : 5);
  }, [isMobile]);

  return (
    <Box p={2}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Complaints
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
      ) : complaints.length === 0 ? (
        <Alert severity="info">No pending complaints found</Alert>
      ) : isMobile ? (
        <Stack spacing={2}>
          {complaints.map((c) => (
            <Card key={c._id}>
              <CardContent>
                <Typography fontWeight="bold">{c._id}</Typography>

                <Typography variant="body2" color="text.secondary">
                  Room {c.roomNum} • {c.type}
                </Typography>

                <Box mt={1}>
                  <ExpandableText text={c.desc} />
                </Box>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  mt={1}
                >
                  {formatDate(c.createdAt)} | {c.studentID} | {c.phoneNum}
                </Typography>

                <Stack direction="row" spacing={1} mt={2} alignItems="center">
                  <Chip
                    label={c.status}
                    color={STATUS_COLORS[c.status]}
                    size="small"
                  />

                  {c.status !== "RESOLVED" && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => updateComplaintStatus(c._id, c.studentID)}
                    >
                      Resolve
                    </Button>
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
                      <b>Created</b>
                    </TableCell>
                    <TableCell>
                      <b>StudentID</b>
                    </TableCell>
                    <TableCell>
                      <b>Phone</b>
                    </TableCell>
                    <TableCell>
                      <b>Room</b>
                    </TableCell>
                    <TableCell>
                      <b>Type</b>
                    </TableCell>
                    <TableCell>
                      <b>Description</b>
                    </TableCell>
                    <TableCell>
                      <b>Status</b>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {complaints.map((c) => (
                    <TableRow key={c._id} hover>
                      <TableCell>{formatDate(c.createdAt)}</TableCell>
                      <TableCell>{c.studentID}</TableCell>
                      <TableCell>{c.phoneNum}</TableCell>
                      <TableCell>{c.roomNum}</TableCell>
                      <TableCell>{c.type}</TableCell>

                      <TableCell sx={{ maxWidth: 250 }}>
                        <ExpandableText text={c.desc} />
                      </TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Chip
                            label={c.status}
                            color={STATUS_COLORS[c.status]}
                            size="small"
                          />
                          {c.status !== "RESOLVED" && (
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => updateComplaintStatus(c._id, c.studentID)}
                            >
                              Resolve
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
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={totalPages}
              page={pageNum}
              onChange={(e, value) => setPageNum(value)}
              color="primary"
            />
          </Box>
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
