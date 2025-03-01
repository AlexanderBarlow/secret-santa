import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";

export default function Dashboard() {
	const [users, setUsers] = useState([]);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);
	const [sortAcceptedFirst, setSortAcceptedFirst] = useState(true);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [userToDelete, setUserToDelete] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const usersResponse = await axios.get("/api/admin/users");
				console.log("API Response:", usersResponse.data); // Debugging step

				if (Array.isArray(usersResponse.data)) {
					setUsers(usersResponse.data || []);
				} else {
					console.error("Unexpected data format:", usersResponse.data);
					setUsers([]); // Ensure users is always an array
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


	const openDeleteModal = (id) => {
		setUserToDelete(id);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setUserToDelete(null);
	};

	const handleRemoveUser = async () => {
		if (!userToDelete) return;

		try {
			const response = await axios.delete(
				`/api/admin/users/remove/${userToDelete}`
			);
			if (response.status === 200) {
				setUsers(users.filter((user) => user.id !== userToDelete));
				closeModal();
			} else {
				setError("Error removing user. Please try again.");
			}
		} catch (err) {
			console.error("Error removing user:", err);
			setError("Failed to remove user. Please try again.");
		}
	};

	const handleAcceptUser = async (id) => {
		try {
			const response = await axios.post("/api/admin/users/accept", { id });

			if (response.status === 200) {
				setUsers(
					users.map((user) =>
						user.id === id ? { ...user, Accepted: true } : user
					)
				);
			} else {
				setError("Error accepting user. Please try again.");
			}
		} catch (err) {
			console.error("Error accepting user:", err);
			setError("Failed to accept user. Please try again.");
		}
	};

	const sortedUsers = [...users].sort((a, b) =>
		sortAcceptedFirst ? b.Accepted - a.Accepted : a.Accepted - b.Accepted
	);

	return (
		<div className="flex flex-col min-h-screen bg-gray-100">
			<div className="flex flex-col items-center flex-grow p-6">
				<h1 className="text-4xl font-bold text-center mb-6 text-black">
					Admin Dashboard
				</h1>

				<button
					onClick={() => setSortAcceptedFirst(!sortAcceptedFirst)}
					className="mb-6 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
				>
					{sortAcceptedFirst
						? "Show Pending Users First"
						: "Show Accepted Users First"}
				</button>

				{error && <p className="text-red-500 text-center">{error}</p>}

				{loading ? (
					<p className="text-center text-black">Admin Dashboard Loading...</p>
				) : (
					<>
						<h2 className="text-2xl mb-4 text-black text-center">
							{users.length > 0
								? `Total Users: ${users.length}`
								: "No users available."}
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
							{sortedUsers.map((user) => (
								<div
									key={user.id}
									className="bg-white p-6 rounded-xl shadow-md border border-gray-300 hover:shadow-xl transition-shadow flex flex-col justify-between min-h-[260px]"
								>
									<h3 className="text-lg font-semibold text-black mb-3 truncate">
										{user.email}
									</h3>

									<h4 className="text-sm text-gray-600 font-semibold">
										Matched Santa:
									</h4>
									<p className="text-black text-sm">
										{user.matchedSanta?.email || "N/A"}
									</p>

									<h4 className="text-sm text-gray-600 font-semibold mt-2">
										Wishlist:
									</h4>
									<ul className="list-disc pl-5 text-black text-sm">
										{user.wishlist?.items?.length > 0 ? (
											user.wishlist.items.map((item, index) => (
												<li key={index}>{item.item}</li>
											))
										) : (
											<li>No items in wishlist.</li>
										)}
									</ul>

									<h4 className="text-sm text-gray-600 font-semibold mt-2">
										Accepted Status:
									</h4>
									<p
										className={`text-sm font-semibold p-2 rounded mt-1 text-center ${
											user.Accepted
												? "bg-green-200 text-green-800"
												: "bg-yellow-200 text-yellow-800"
										}`}
									>
										{user.Accepted ? "Accepted" : "Pending"}
									</p>

									<div className="flex gap-2 mt-4">
										{!user.Accepted && (
											<button
												onClick={() => handleAcceptUser(user.id)}
												className="p-3 w-1/2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors"
											>
												Accept
											</button>
										)}
										<button
											onClick={() => openDeleteModal(user.id) && setUserToDelete(user.id)}
											className={`p-3 ${
												user.Accepted ? "w-full" : "w-1/2"
											} bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors`}
										>
											Remove
										</button>
									</div>
								</div>
							))}
						</div>
					</>
				)}
			</div>

			{isModalOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
						<h2 className="text-xl font-semibold mb-4 text-black">
							Confirm Deletion
						</h2>
						<p className="text-black mb-4">
							Are you sure you want to remove this user? This action cannot be
							undone.
						</p>
						<div className="flex justify-center gap-4">
							<button
								onClick={handleRemoveUser}
								className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600"
							>
								Yes, Remove
							</button>
							<button
								onClick={closeModal}
								className="px-4 py-2 bg-gray-300 text-black rounded shadow hover:bg-gray-400"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		
			<AdminNavbar />
		</div>
	);
}
