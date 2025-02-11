import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";

export default function Dashboard() {
	const [users, setUsers] = useState([]);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const usersResponse = await axios.get(
					"http://localhost:3000/api/admin/users"
				);
				if (usersResponse.status === 200) {
					setUsers(usersResponse.data);
				} else {
					setUsers([]);
				}
			} catch (err) {
				console.error("Error fetching data", err);
				setError("Failed to load data. Please try again later.");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	return (
		<div className="flex flex-col justify-between min-h-screen bg-gray-100">
			{/* Main Content */}
			<div className="flex flex-col items-center flex-grow p-6">
				<h1 className="text-3xl font-semibold text-center mb-6 text-black">
					Admin Dashboard
				</h1>

				{/* Error Message */}
				{error && <p className="text-red-500 text-center">{error}</p>}

				{/* Loading Indicator */}
				{loading ? (
					<p className="text-center text-black">Admin Dashboard Loading...</p>
				) : (
					<>
						<h2 className="text-xl mb-4 text-black text-center">
							{users.length > 0
								? `Total Users: ${users.length}`
								: "No users available."}
						</h2>

						{/* User Cards Grid */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
							{users.map((user) => (
								<div
									key={user.id}
									className="bg-white p-6 rounded-lg shadow-md border border-gray-300 flex flex-col justify-between min-h-[180px] break-words"
								>
									<h3 className="text-lg font-semibold text-black mb-2 truncate">
										User ID: {user.id}
									</h3>
									<p className="text-black text-sm break-words">
										<strong>Email:</strong> {user.email}
									</p>
									<p className="text-black text-sm truncate">
										<strong>Password:</strong> {user.password}
									</p>
									<p className="text-black text-sm">
										<strong>Created At:</strong>{" "}
										{new Date(user.createdAt).toLocaleDateString("en-US", {
											month: "long",
											day: "numeric",
											year: "numeric",
										})}
									</p>
								</div>
							))}
						</div>
					</>
				)}
			</div>

			{/* Bottom Navigation Bar */}
			<AdminNavbar />
		</div>
	);
}
