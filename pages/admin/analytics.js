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
	useMediaQuery,
	TextField,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
} from "@mui/material";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";

export default function AdminAnalytics() {
	const [analyticsData, setAnalyticsData] = useState(null);
	const [userData, setUserData] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [search, setSearch] = useState("");
	const [roleFilter, setRoleFilter] = useState("");
	const [acceptedFilter, setAcceptedFilter] = useState("");

	const isMobile = useMediaQuery("(max-width: 600px)");

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
				setFilteredUsers(response.data);
				setError(null);
			} catch (error) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		getUsers();
	}, []);

	// Filtering Function
	useEffect(() => {
		let filtered = userData;

		if (search) {
			filtered = filtered.filter((user) =>
				user.email.toLowerCase().includes(search.toLowerCase())
			);
		}

		if (roleFilter) {
			filtered = filtered.filter((user) => user.role === roleFilter);
		}

		if (acceptedFilter) {
			filtered = filtered.filter(
				(user) => user.Accepted.toString() === acceptedFilter
			);
		}

		setFilteredUsers(filtered);
	}, [search, roleFilter, acceptedFilter, userData]);

	if (loading || !analyticsData || userData.length === 0) {
		return (
			<Box sx={{ p: 3, backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
				<Skeleton
					variant="rectangular"
					height={400}
					sx={{ mt: 4, borderRadius: 3 }}
				/>
			</Box>
		);
	}

	if (error) return <div>Error: {error}</div>;

	// Calculate Analytics Totals
	const acceptedUsers = analyticsData.acceptedUsers || 0;
	const unacceptedUsers = analyticsData.totalUsers - acceptedUsers;
	const bohUsers = analyticsData.bohUsers || 0;
	const fohUsers = analyticsData.fohUsers || 0;
	const totalUsers = analyticsData.totalUsers || 1;

	const acceptedPercentage = ((acceptedUsers / totalUsers) * 100).toFixed(2);
	const bohPercentage = ((bohUsers / totalUsers) * 100).toFixed(2);
	const fohPercentage = ((fohUsers / totalUsers) * 100).toFixed(2);

	return (
		<Box sx={{ p: 3, backgroundColor: "#f4f6f8", minHeight: "100vh", pb: 20 }}>
			<Typography
				variant={isMobile ? "h5" : "h4"}
				sx={{ mb: 3, textAlign: "center", fontWeight: "bold", color: "#333" }}
			>
				📊 Admin Analytics Dashboard
			</Typography>

			{/* Progress Bars Section */}
			<Grid container spacing={2} justifyContent="center">
				{[
					{
						label: `Accepted: ${acceptedUsers} / Unaccepted: ${unacceptedUsers}`,
						value: acceptedPercentage,
						color: "#4CAF50",
					},
					{
						label: `Back of House: ${bohUsers} / Total: ${totalUsers}`,
						value: bohPercentage,
						color: "#2196F3",
					},
					{
						label: `Front of House: ${fohUsers} / Total: ${totalUsers}`,
						value: fohPercentage,
						color: "#F44336",
					},
				].map((stat, index) => (
					<Grid item key={index} xs={12} sm={6} md={4} style={{paddingBottom: 20}}>
						<Card
							sx={{
								p: 3,
								borderRadius: 3,
								boxShadow: 3,
								backgroundColor: "white",
								textAlign: isMobile ? "center" : "left",
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

			{/* Filtering Options */}
			<Grid container spacing={2} sx={{ mb: 3 }}>
				<Grid item xs={12} sm={4}>
					<TextField
						fullWidth
						label="Search by Name or Email"
						variant="outlined"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</Grid>
				<Grid item xs={12} sm={4}>
					<FormControl fullWidth>
						<InputLabel>Filter by Role</InputLabel>
						<Select
							value={roleFilter}
							onChange={(e) => setRoleFilter(e.target.value)}
						>
							<MenuItem value="">All Roles</MenuItem>
							<MenuItem value="FRONT_OF_HOUSE">Front of House</MenuItem>
							<MenuItem value="BACK_OF_HOUSE">Back of House</MenuItem>
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={12} sm={4}>
					<FormControl fullWidth>
						<InputLabel>Accepted Status</InputLabel>
						<Select
							value={acceptedFilter}
							onChange={(e) => setAcceptedFilter(e.target.value)}
						>
							<MenuItem value="">All Users</MenuItem>
							<MenuItem value="true">Accepted</MenuItem>
							<MenuItem value="false">Not Accepted</MenuItem>
						</Select>
					</FormControl>
				</Grid>
			</Grid>

			{/* User Table */}
			<TableContainer
				component={Paper}
				sx={{ mt: 4, borderRadius: 3, boxShadow: 3, overflowX: "auto" }}
			>
				<Table>
					<TableHead sx={{ backgroundColor: "#1976d2" }}>
						<TableRow>
							{["ID", "Name", "Date Created", "Role", "Accepted"].map(
								(header) => (
									<TableCell
										key={header}
										sx={{
											color: "white",
											fontWeight: "bold",
											whiteSpace: "nowrap",
										}}
									>
										{header}
									</TableCell>
								)
							)}
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredUsers.map((user, index) => (
							<TableRow
								key={index}
								sx={{ backgroundColor: index % 2 ? "#f9f9f9" : "white" }}
							>
								<TableCell>{user.id}</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell>
									{new Date(user.createdAt).toLocaleDateString()}
								</TableCell>
								<TableCell>{user.role}</TableCell>
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
