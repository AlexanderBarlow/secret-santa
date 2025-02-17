import { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";
import { Loader2 } from "lucide-react"; // Loading icon for better UX

export default function MatchSantaPage() {
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [matches, setMatches] = useState([]);
	const [unpaired, setUnpaired] = useState([]);
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axios.get("/api/admin/users");
				setUsers(response.data);

				const unpairedUsers = response.data.filter(
					(user) => !user.matchedSanta && !user.matchedBy
				);
				setUnpaired(unpairedUsers);
			} catch (error) {
				console.error("Error fetching users:", error);
			}
		};
		fetchUsers();
	}, []);

	const handleMatchUsers = async () => {
		setLoading(true);
		setMessage("");

		try {
			const response = await axios.post("/api/admin/users/matchusers");
			if (response.status === 200) {
				setMessage("Users have been successfully matched!");

				const updatedUsersResponse = await axios.get("/api/admin/users");
				const updatedUsers = updatedUsersResponse.data;

				setUsers(updatedUsers);

				const pairedUserEmails = updatedUsers
					.filter((user) => user.matchedSanta || user.matchedBy)
					.map((user) => user.email);

				setUnpaired(
					updatedUsers.filter((user) => !pairedUserEmails.includes(user.email))
				);
			} else {
				setMessage("An error occurred during the matching process.");
			}
		} catch (error) {
			setMessage("An error occurred during the matching process.");
		} finally {
			setLoading(false);
		}
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
