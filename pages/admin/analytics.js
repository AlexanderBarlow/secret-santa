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
import { getUsers } from "@/lib/auth";

export default function AdminAnalytics() {
	const [analyticsData, setAnalyticsData] = useState(null);
	const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState([]);

	// Fetch analytics data from the API
	useEffect(() => {
		const fetchAnalyticsData = async () => {
			try {
				const response = await axios.get("/api/analytics");
				if (response.status !== 200) {
					throw new Error("Failed to fetch data");
				}
        setAnalyticsData(response.data);
        console.log(response.data);
				setLoading(false);
				setError(null);
			} catch (error) {
				setError(error.message);
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
          console.log(response.data);
					setLoading(false);
					setError(null);
				} catch (error) {
					setError(error.message);
					setLoading(false);
				}
			};

			getUsers()
		}, []);

	// Show loading message or error if the data is not yet fetched or there's an error
	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	// Ensure data is available before rendering
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

			{/* Top Section: Circular Progress Bars */}
			<Grid container spacing={6} justifyContent="center">
				{[
					{
						label: "Accepted Users",
						value: analyticsData.acceptedUsers || 0, // Ensure zero is handled
						color: "#ff9800",
					},
					{
						label: "Users with Wishlists",
						value: analyticsData.usersWithWishlists || 0, // Ensure zero is handled
						color: "#2196f3",
					},
					{
						label: "Users with Items",
						value: analyticsData.usersWithItems || 0, // Ensure zero is handled
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
								value={
									stat.value === 0
										? 0 // Ensure 0 value shows as 0% progress
										: (stat.value / analyticsData.totalUsers) * 100
								}
								size={140}
								thickness={6}
								sx={{ color: stat.color }}
							/>
							<Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
								{stat.value === 0
									? "0.00%" // Show 0.00% when value is 0
									: ((stat.value / analyticsData.totalUsers) * 100).toFixed(2) +
									  "%"}
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
								Date Created
							</TableCell>
							<TableCell sx={{ color: "white", fontWeight: "bold" }}>
								Passowrd
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody sx={{ color: "white", fontWeight: "bold" }}>
						{userData.map((user, index) => (
							<TableRow
								key={index}
								sx={{ "&:nth-of-type(even)": { backgroundColor: "#f9f9f9" } }}
							>
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
		</Box>
	);
}
