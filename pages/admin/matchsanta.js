import { useState } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar"; // Import AdminNavbar

export default function MatchSantaPage() {
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [matches, setMatches] = useState([]); // To hold the matches

	const handleMatchUsers = async () => {
		setLoading(true);
		setMessage(""); // Reset message before request

		try {
			// Trigger the matching API endpoint
			const response = await axios.post("/api/admin/users/matchusers");
			console.log(response);

			if (response.status === 200) {
				setMessage("Users have been successfully matched!");
				setMatches(response.data.matches); // Set the matches received from the API
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
		<div className="flex flex-col min-h-screen bg-gray-100">
			{/* Main Content Wrapper */}
			<div className="flex flex-grow justify-center items-center p-8">
				<div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
					<h1 className="text-3xl text-red-500 font-semibold text-center mb-6">
						Match Santa
					</h1>

					<button
						onClick={handleMatchUsers}
						disabled={loading}
						className="w-full py-3 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
					>
						{loading ? "Matching..." : "Match Users"}
					</button>

					{message && (
						<p
							className={`mt-4 text-center ${
								message.includes("Error") ? "text-red-500" : "text-green-500"
							}`}
						>
							{message}
						</p>
					)}

					{/* Display Matches */}
					{matches.length > 0 && (
						<div className="mt-6">
							<h2 className="text-xl font-semibold text-center text-black">
								Matched Users
							</h2>
							<ul className="list-disc pl-6 mt-4">
								{matches.map((match, index) => (
									<li key={index} className="mb-2 text-black">
										{match.giver} is buying for {match.receiver}
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			</div>
			{/* Admin Navbar */}
			<AdminNavbar />
		</div>
	);
}
