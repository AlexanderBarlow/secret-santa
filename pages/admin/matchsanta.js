import { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";
import { Loader2 } from "lucide-react"; // Loading icon for better UX

export default function MatchSantaPage() {
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [users, setUsers] = useState([]);
	const [unpaired, setUnpaired] = useState([]);
	const [selectedReceivers, setSelectedReceivers] = useState({}); // Store selected receivers by user ID

	// Fetch all users and their matching status
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axios.get("/api/admin/users");
				setUsers(response.data);
				updateUnpairedList(response.data);
			} catch (error) {
				console.error("Error fetching users:", error);
			}
		};
		fetchUsers();
	}, []);

	// Update the unpaired list whenever users change
	const updateUnpairedList = (userList) => {
		const unpairedUsers = userList.filter((user) => user.matchedBy === null); // Users with no giver
		setUnpaired(unpairedUsers);
	};

	// Handle matching users
	const handleMatchUsers = async () => {
		setLoading(true);
		setMessage("");

		try {
			const response = await axios.post("/api/admin/users/matchusers");
			if (response.status === 200) {
				setMessage("Users have been successfully matched!");

				// Fetch the latest users and update the UI
				const updatedUsersResponse = await axios.get("/api/admin/users");
				const updatedUsers = updatedUsersResponse.data;
				setUsers(updatedUsers);
				updateUnpairedList(updatedUsers);
			} else {
				setMessage("An error occurred during the matching process.");
			}
		} catch (error) {
			setMessage("An error occurred during the matching process.");
		} finally {
			setLoading(false);
		}
	};

	// Unmatch users (removes the match)
	const handleUnmatch = async (giverId, receiverId) => {
		try {
			const response = await axios.post("/api/admin/users/unmatch", {
				giverId,
				receiverId,
			});
			if (response.status === 200) {
				// Update UI and unpaired list after unmatch
				const updatedUsers = users.map((user) =>
					user.id === giverId
						? { ...user, matchedSanta: null }
						: user.id === receiverId
						? { ...user, matchedBy: null }
						: user
				);
				setUsers(updatedUsers);
				updateUnpairedList(updatedUsers);
				setMessage("Match has been removed.");
			} else {
				setMessage("An error occurred while unmatching.");
			}
		} catch (error) {
			setMessage("An error occurred while unmatching.");
		}
	};

	// Assign a receiver to a giver
	const handleSelectReceiver = async (giverId, receiverId) => {
		try {
			const response = await axios.post("/api/admin/users/selectreceiver", {
				giverId: giverId,
				receiverId: Number(receiverId),
			});

			if (response.status === 200) {
				// Fetch the updated receiver to get the full data
				const receiver = unpaired.find(
					(user) => user.id === Number(receiverId)
				);

				// Update UI after assigning receiver
				const updatedUsers = users.map((user) =>
					user.id === giverId
						? { ...user, matchedSanta: receiver } // Store full receiver data
						: user
				);

				// Filter out the assigned receiver from the unpaired list
				const updatedUnpaired = unpaired.filter(
					(user) => user.id !== Number(receiverId)
				);
				setUsers(updatedUsers);
				setUnpaired(updatedUnpaired); // Update unpaired list
				setMessage("Receiver has been assigned.");
			} else {
				setMessage("An error occurred while assigning the receiver.");
			}
		} catch (error) {
			if (error.response && error.response.status === 400) {
				setMessage("Invalid request: Giver and receiver cannot be the same.");
			} else {
				setMessage("An unexpected error occurred.");
			}
		}
	};

	// Handle the selection of a receiver for each user
	const handleReceiverChange = (giverId, receiverId) => {
		setSelectedReceivers((prevState) => ({
			...prevState,
			[giverId]: receiverId,
		}));
	};

	return (
		<div className="flex flex-col min-h-screen bg-gray-50">
			<div className="flex flex-grow justify-center items-center p-6">
				<div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg">
					<h1 className="text-3xl font-bold text-red-600 text-center mb-6">
						Match Santa 🎅
					</h1>

					{message && (
						<p className="text-center text-green-600 font-medium mb-4">
							{message}
						</p>
					)}

					<button
						onClick={handleMatchUsers}
						disabled={loading}
						className="w-full flex justify-center items-center gap-2 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition focus:outline-none focus:ring-2 focus:ring-red-400"
					>
						{loading ? (
							<Loader2 className="animate-spin" size={20} />
						) : (
							"Generate Matches"
						)}
					</button>

					<div className="mt-8">
						<h2 className="text-2xl font-semibold text-gray-800 text-center">
							Matched Results 🎁
						</h2>

						{users.length > 0 ? (
							<ul className="mt-4 space-y-4">
								{users.map((user, index) => (
									<li
										key={index}
										className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between items-center"
									>
										<span className="font-medium text-gray-900">
											{user.email || "No giver"}
										</span>
										<span className="text-gray-600 text-lg">➡️</span>
										<span className="font-medium text-gray-900">
											{user.matchedSanta?.email || "No receiver"}
										</span>
										<div className="flex space-x-2">
											{/* Button to unmatch the pair */}
											{user.matchedSanta && (
												<button
													onClick={() =>
														handleUnmatch(user.id, user.matchedSanta.id)
													}
													className="bg-red-500 text-white px-3 py-1 rounded-lg"
												>
													Unmatch
												</button>
											)}

											{/* Button to assign a new receiver */}
											{user.matchedSanta === null && unpaired.length > 0 && (
												<div className="relative flex items-center gap-2">
													<select
														onChange={(e) =>
															handleReceiverChange(user.id, e.target.value)
														}
														value={selectedReceivers[user.id] || ""}
														className="bg-blue-500 text-white px-3 py-1 rounded-lg flex-1"
													>
														<option value={""} disabled>
															Select Receiver
														</option>
														{unpaired.map((unpairedUser) => (
															<option
																key={unpairedUser.id}
																value={unpairedUser.id}
															>
																{unpairedUser.email}
															</option>
														))}
													</select>
													<button
														onClick={() =>
															selectedReceivers[user.id] &&
															handleSelectReceiver(
																user.id,
																selectedReceivers[user.id]
															)
														}
														className="bg-green-500 text-white px-3 py-1 rounded-lg"
													>
														Assign
													</button>
												</div>
											)}
										</div>
									</li>
								))}
							</ul>
						) : (
							<p className="text-center text-gray-500 mt-4">
								Start matching now to generate Santa pairs!
							</p>
						)}

						<div className="mt-6">
							<h2 className="text-xl font-semibold text-center text-black">
								Unpaired Users ❌
							</h2>
							{unpaired.length > 0 ? (
								<ul className="mt-4 list-disc pl-6">
									{unpaired.map((user, index) => (
										<li key={index} className="text-gray-900">
											{user.email}
										</li>
									))}
								</ul>
							) : (
								<p className="mt-4 text-center text-gray-500">
									All users are paired. 🎉
								</p>
							)}
						</div>
					</div>
				</div>
			</div>

			<AdminNavbar />
		</div>
	);
}
