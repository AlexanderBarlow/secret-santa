import { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar"; // Import AdminNavbar
import Select from "react-select"; // Enhanced dropdown UI

export default function MatchSantaPage() {
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState("");
	const [matches, setMatches] = useState([]); // Holds the matches
	const [unpaired, setUnpaired] = useState([]); // Holds unpaired users
	const [users, setUsers] = useState([]); // All users

	// Fetch users and initialize unpaired list
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axios.get("/api/admin/users"); // Endpoint to get all users
				setUsers(response.data.users);
				setUnpaired(response.data.users); // Initially, all users are unpaired
			} catch (error) {
				console.error("Error fetching users:", error);
			}
		};
		fetchUsers();
	}, []);

  const handleMatchUsers = async () => {
    setLoading(true);
    setMessage(""); // Reset message before request

		try {
			const response = await axios.post("/api/admin/users/matchusers");
			if (response.status === 200) {
				setMessage("Users have been successfully matched!");
				setMatches(response.data.matches);

				// Update unpaired list based on matches
				const pairedUsers = response.data.matches.flatMap((match) => [
					match.giver,
					match.receiver,
				]);
				setUnpaired(users.filter((user) => !pairedUsers.includes(user)));
			} else {
				setMessage("An error occurred during the matching process.");
			}
		} catch (error) {
			setMessage("An error occurred during the matching process.");
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateMatch = (giver, newReceiver) => {
		setMatches((prevMatches) =>
			prevMatches.map((match) =>
				match.giver === giver ? { ...match, receiver: newReceiver } : match
			)
		);
		setUnpaired((prevUnpaired) => {
			const safePrevUnpaired = Array.isArray(prevUnpaired) ? prevUnpaired : [];
			return [...safePrevUnpaired, currentReceiver].filter(
				(user) => user !== newReceiver
			);
		});
	};

	const handleSaveChanges = async () => {
		setSaving(true);
		try {
			const response = await axios.post("/api/admin/users/savematches", {
				matches,
			});
			if (response.status === 200) {
				setMessage("Matches saved successfully!");
			} else {
				setMessage("An error occurred while saving matches.");
			}
		} catch (error) {
			console.error("Error saving matches:", error);
			setMessage("An error occurred while saving matches.");
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="flex flex-col min-h-screen bg-gray-100">
			{/* Main Content Wrapper */}
			<div className="flex flex-grow justify-center items-center p-8">
				<div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
					<h1 className="text-3xl text-red-500 font-semibold text-center mb-6">
						Match Santa
					</h1>

					<button
						onClick={handleMatchUsers}
						disabled={loading}
						className="w-full py-3 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
					>
						{loading ? "Matching..." : "Generate Matches"}
					</button>

      {/* Matches Container */}
      <div className="flex justify-center items-start mt-16 px-4">
        <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
            Matched Results
          </h2>

					{/* Matches Section */}
					{matches.length > 0 && (
						<div className="mt-6">
							<h2 className="text-xl font-semibold text-center text-black">
								Matched Users
							</h2>
							<ul className="mt-4 space-y-4">
								{matches.map((match, index) => (
									<li key={index} className="flex items-center space-x-4">
										<span className="text-black font-semibold">
											{match.giver}
										</span>
										<span className="text-gray-500">→</span>
										<Select
											value={{
												label: match.receiver,
												value: match.receiver,
											}}
											options={[
												...(unpaired ??
													[].map((user) => ({
														label: user,
														value: user,
													}))),
												{ label: match.receiver, value: match.receiver }, // Include current receiver
											]}
											onChange={(selectedOption) =>
												handleUpdateMatch(match.giver, selectedOption.value)
											}
											isDisabled={unpaired?.length === 0}
										/>
									</li>
								))}
							</ul>
						</div>
					)}

					{/* Unpaired Users */}
					<div className="mt-6">
						<h2 className="text-xl font-semibold text-center text-black">
							Unpaired Users
						</h2>
						{unpaired?.length > 0 ? (
							<ul className="mt-4 list-disc pl-6">
								{unpaired.map((user, index) => (
									<li key={index} className="text-black">
										{user}
									</li>
								))}
							</ul>
						) : (
							<p className="mt-4 text-center text-gray-500">
								All users are paired.
							</p>
						)}
					</div>

					{/* Save Changes Button */}
					<button
						onClick={handleSaveChanges}
						disabled={saving}
						className="w-full py-3 mt-6 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
					>
						{saving ? "Saving..." : "Save Matches"}
					</button>
				</div>
			</div>
			{/* Admin Navbar */}
			<AdminNavbar />
		</div>
	);
}
