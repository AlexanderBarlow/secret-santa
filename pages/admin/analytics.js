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
} from "@mui/material";
import axios from "axios";

export default function AdminAnalytics() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch analytics data from the API
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = axios.get("/api/analytics");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setAnalyticsData(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  // Show loading message or error if the data is not yet fetched or there's an error
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Ensure data is available before rendering
  if (!analyticsData || !analyticsData.users) {
    return <div>No data available</div>;
  }

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        sx={{ mb: 4, textAlign: "center", fontWeight: "bold" }}
      >
        Admin Analytics
      </Typography>

      {/* Top Section: Circular Progress Bars */}
      <Grid container spacing={6} justifyContent="center">
        {[
          {
            label: "Total Users",
            value: analyticsData.totalUsers,
            color: "#4caf50",
          },
          {
            label: "Accepted Users",
            value: analyticsData.acceptedUsers,
            color: "#ff9800",
          },
          {
            label: "Users with Wishlists",
            value: analyticsData.usersWithWishlists,
            color: "#2196f3",
          },
          {
            label: "Users with Items",
            value: analyticsData.usersWithItems,
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
                value={(stat.value / analyticsData.totalUsers) * 100} // Calculate percentage
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

      {/* Bottom Section: Data Table */}
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
                Email
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {analyticsData.users.map((user) => (
              <TableRow
                key={user.id}
                sx={{ "&:nth-of-type(even)": { backgroundColor: "#f9f9f9" } }}
              >
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell
                  sx={{
                    color: user.activity === "Active" ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {user.activity}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
