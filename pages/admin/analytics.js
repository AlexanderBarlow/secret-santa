import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CircularProgress,
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
import { getUsers } from "../../lib/auth";
import AdminNavbar from "../../components/AdminNavbar";

export default function AdminAnalytics() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState([]);

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

  if (loading) {
    return (
      <Box sx={{ p: 4, backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
        <Grid container spacing={6} justifyContent="center">
          {[...Array(3)].map((_, index) => (
            <Grid item key={index}>
              <Card
                sx={{
                  width: 200,
                  height: 250,
                  p: 3,
                  borderRadius: 3,
                  boxShadow: 3,
                }}
              >
                <Skeleton variant="circular" width={140} height={140} />
                <Skeleton
                  variant="text"
                  height={30}
                  width="60%"
                  sx={{ mt: 2 }}
                />
                <Skeleton variant="text" height={20} width="80%" />
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

  if (!analyticsData || !analyticsData.totalUsers) {
    return <div>No data available</div>;
  }

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        sx={{ mb: 4, textAlign: "center", fontWeight: "bold", color: "black" }}
      >
        Admin Analytics
      </Typography>

      <Grid container spacing={6} justifyContent="center">
        {[
          {
            label: "Accepted Users",
            value: analyticsData.acceptedUsers || 0,
            color: "#ff9800",
          },
          {
            label: "Users with Wishlists",
            value: analyticsData.usersWithWishlists || 0,
            color: "#2196f3",
          },
          {
            label: "Users Matched",
            value: analyticsData.usersWithSantas || 0,
            color: "#f44336",
          },
        ].map((stat, index) => (
          <Grid item key={index}>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: 200,
                height: 250,
                p: 3,
                borderRadius: 3,
                boxShadow: 3,
              }}
            >
              <CircularProgress
                variant="determinate"
                value={(stat.value / analyticsData.totalUsers) * 100}
                size={140}
                thickness={6}
                sx={{ color: stat.color }}
              />
              <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
                {((stat.value / analyticsData.totalUsers) * 100).toFixed(2)}%
              </Typography>
              <Typography variant="body2" sx={{ color: "gray" }}>
                {stat.label}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

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
                Password
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userData.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {user.password}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AdminNavbar />
    </Box>
  );
}
