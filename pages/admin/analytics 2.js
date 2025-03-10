import { useEffect, useState } from "react";
import {
  Box,
  Card,
  LinearProgress,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
} from "@mui/material";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";

export default function AdminAnalytics() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await axios.get("/api/analytics");
        if (response.status !== 200) {
          throw new Error("Failed to fetch data");
        }
        setAnalyticsData(response.data);
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get("/api/admin/userdata");
        if (response.status !== 200) {
          throw new Error("Failed to fetch data");
        }
        setUserData(response.data);
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  // Show only the skeleton while loading
  if (loading || !analyticsData || userData.length === 0) {
    return (
      <Box sx={{ p: 4, backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
        <Grid container spacing={6} justifyContent="center">
          {[...Array(3)].map((_, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: 3,
                  backgroundColor: "white",
                }}
              >
                <Skeleton variant="text" height={30} width="60%" />
                <Skeleton variant="rectangular" height={20} width="100%" />
              </Card>
            </Grid>
          ))}
        </Grid>
        <Skeleton
          variant="rectangular"
          height={400}
          sx={{ mt: 6, borderRadius: 3 }}
        />
      </Box>
    );
  }

  if (error) return <div>Error: {error}</div>;

  // Calculate percentages for comparisons
  const acceptedUsers = analyticsData.acceptedUsers || 0;
  const unacceptedUsers = analyticsData.totalUsers - acceptedUsers;
  const bohUsers = analyticsData.bohUsers || 0;
  const fohUsers = analyticsData.fohUsers || 0;
  const totalUsers = analyticsData.totalUsers || 1;

  const acceptedPercentage = ((acceptedUsers / totalUsers) * 100).toFixed(2);
  const bohPercentage = ((bohUsers / totalUsers) * 100).toFixed(2);
  const fohPercentage = ((fohUsers / totalUsers) * 100).toFixed(2);

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          textAlign: "center",
          fontWeight: "bold",
          color: "#333",
        }}
      >
        📊 Admin Analytics Dashboard
      </Typography>

      {/* Progress Bars Section */}
      <Grid container spacing={4} justifyContent="center">
        {[
          {
            label: "Accepted vs Unaccepted",
            value: acceptedPercentage,
            color: "#4CAF50",
          },
          {
            label: "Back of House vs Total",
            value: bohPercentage,
            color: "#2196F3",
          },
          {
            label: "Front of House vs Total",
            value: fohPercentage,
            color: "#F44336",
          },
        ].map((stat, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Card
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: 3,
                backgroundColor: "white",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#333" }}
              >
                {stat.label}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={stat.value}
                sx={{
                  height: 10,
                  mt: 2,
                  borderRadius: 5,
                  backgroundColor: "#ddd",
                  "& .MuiLinearProgress-bar": { backgroundColor: stat.color },
                }}
              />
              <Typography
                variant="body1"
                sx={{ mt: 1, fontWeight: "bold", textAlign: "right" }}
              >
                {stat.value}%
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* User Table */}
      <TableContainer
        component={Paper}
        sx={{ mt: 6, borderRadius: 3, boxShadow: 3 }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                ID
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Name
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Date Created
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Role
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Accepted
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userData.map((user, index) => (
              <TableRow
                key={index}
                sx={{ backgroundColor: index % 2 ? "#f9f9f9" : "white" }}
              >
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {user.role === "FRONT_OF_HOUSE"
                    ? "Front of House"
                    : user.role === "BACK_OF_HOUSE"
                    ? "Back of House"
                    : "Unassigned"}
                </TableCell>
                <TableCell>{user.Accepted ? "✔️ Yes" : "❌ No"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AdminNavbar />
    </Box>
  );
}
