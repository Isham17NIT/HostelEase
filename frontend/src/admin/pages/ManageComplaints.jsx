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
  Alert
} from "@mui/material";
import api from "../../api/axiosInstance.js";

const STATUS_COLORS = {
  PENDING: "warning",
  RESOLVED: "success",
};

/* Expandable Text  */
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

  const getPendingComplaints = async () => {
    setError("");
    setLoading(true);
    // backend api call
    try {
      const response = await api.get("/admin/complaints/pending", {
        withCredentials: true,
      });
      setComplaints(response.data?.data?.pendingComplaints || []);
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

  useEffect(() => {
    getPendingComplaints();
  }, []);

  const handleResolve = async (id) => {
    setError("");
    setLoading(true)

    try {
      const response = await api.patch(
        `/admin/complaints/{id}`,
        { newStatus: "RESOLVED" },
        { withCredentials: true },
      );
      await getPendingComplaints()
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Error while updating complaint status",
      );
    } finally {
      setLoading(false)
    }
  };

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

      {loading ? 
      (
        <Box py={6} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : complaints.length===0 ? (
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
                  {c.createdAt} | {c.studentID} | {c.phoneNum}
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
                      onClick={handleResolve}
                    >
                      Resolve
                    </Button>
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
                      <TableCell>{c.createdAt}</TableCell>
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
                              onClick={handleResolve}
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
        </Card>
      )}
    </Box>
  );
}
