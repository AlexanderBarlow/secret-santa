import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar"; // Import the AdminNavbar component

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
				if (usersResponse.status === 200 && usersResponse.data.length > 0) {
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
			<div className="flex justify-center items-center flex-grow">
				<div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
					<h1 className="text-3xl font-semibold text-center mb-6 text-black">
						Admin Dashboard
					</h1>

					{/* Error Message */}
					{error && <p className="text-red-500 text-center">{error}</p>}

					{/* Loading Indicator */}
					{loading && <p className="text-center text-black">Loading...</p>}

					{/* Users Section */}
					<h2 className="text-xl mt-4 text-black text-center">
						{users.length > 0
							? `Total Users: ${users.length}`
							: "No users available."}
					</h2>

					{/* List of Users */}
					{users.length > 0 && (
						<ul className="mt-4">
							{users.map((user) => (
								<li key={user.id} className="border-b py-2">
									<p className="text-black">
										<strong>ID:</strong> {user.id}
									</p>
									<p className="text-black">
										<strong>Email:</strong> {user.email}
									</p>
									<p className="text-black">
										<strong>Created At:</strong>{" "}
										{new Date(user.createdAt).toLocaleDateString("en-US", {
											month: "long",
											day: "numeric",
											year: "numeric",
										})}
									</p>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>

			{/* Bottom Navigation Bar */}
			<AdminNavbar />
		</div>
	);
}
