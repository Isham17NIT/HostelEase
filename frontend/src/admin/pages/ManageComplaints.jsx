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
  RESOLVED: "success",
};

const initialComplaints = [
  {
    _id: "CMP001",
    createdAt: "2025-01-10",
    rollNum: "CS23B001",
    phone: "9876543210",
    room: "103",
    type: "Electricity",
    description:
      "Fan not working properly. It makes noise and stops intermittently, causing inconvenience especially at night.",
    status: "PENDING",
  },
  {
    _id: "CMP002",
    createdAt: "2025-01-12",
    rollNum: "CS23B045",
    phone: "9123456789",
    room: "210",
    type: "Water",
    description: "Tap leakage near the wash basin.",
    status: "RESOLVED",
  },
  {
    _id: "CMP003",
    createdAt: "2025-01-13",
    rollNum: "CS23B078",
    phone: "9012345678",
    room: "211",
    type: "Water",
    description:
      "Low water pressure in the bathroom due to possible blockage in the pipeline connected to the overhead tank.",
    status: "PENDING",
  },
];

/* ================= Expandable Text ================= */
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

/* ================= Main Component ================= */
export default function ManageComplaints() {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [complaints, setComplaints] = useState(initialComplaints);

  const updateStatus = (id, newStatus) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c._id === id ? { ...c, status: newStatus } : c
      )
    );
  };

  return (
    <Box p={2}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Complaints
      </Typography>

      {/* 📱 MOBILE VIEW */}
      {isMobile ? (
        <Stack spacing={2}>
          {complaints.map((c) => (
            <Card key={c._id}>
              <CardContent>
                <Typography fontWeight="bold">{c._id}</Typography>

                <Typography variant="body2" color="text.secondary">
                  Room {c.room} • {c.type}
                </Typography>

                <Box mt={1}>
                  <ExpandableText text={c.description} />
                </Box>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  mt={1}
                >
                  {c.createdAt} | {c.rollNum}
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  mt={2}
                  alignItems="center"
                >
                  <Chip
                    label={c.status}
                    color={STATUS_COLORS[c.status]}
                    size="small"
                  />

                  {c.status !== "RESOLVED" && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        updateStatus(c._id, "RESOLVED")
                      }
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
        /* 💻 DESKTOP VIEW */
        <Card>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><b>Created</b></TableCell>
                    <TableCell><b>Roll No.</b></TableCell>
                    <TableCell><b>Phone</b></TableCell>
                    <TableCell><b>Room</b></TableCell>
                    <TableCell><b>Type</b></TableCell>
                    <TableCell><b>Description</b></TableCell>
                    <TableCell><b>Status</b></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {complaints.map((c) => (
                    <TableRow key={c._id} hover>
                      <TableCell>{c.createdAt}</TableCell>
                      <TableCell>{c.rollNum}</TableCell>
                      <TableCell>{c.phone}</TableCell>
                      <TableCell>{c.room}</TableCell>
                      <TableCell>{c.type}</TableCell>

                      <TableCell sx={{ maxWidth: 250 }}>
                        <ExpandableText text={c.description} />
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
                              onClick={() =>
                                updateStatus(c._id, "RESOLVED")
                              }
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
