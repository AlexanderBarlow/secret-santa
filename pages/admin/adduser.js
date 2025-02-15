import { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";

export default function SetAdminCode() {
	const [adminCode, setAdminCode] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [currentCode, setCurrentCode] = useState("");

	// Fetch the current admin code when the component mounts
	useEffect(() => {
		const fetchAdminCode = async () => {
			try {
				const response = await axios.get("/api/admin/users/adduser");
				setCurrentCode(response.data.adminCode); // Set the fetched admin code
			} catch (err) {
				setError(err.response?.data?.error || "Failed to fetch admin code.");
			}
		};

		fetchAdminCode();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess(false);

		try {
			// Send the updated admin code to the API
			await axios.post("/api/admin/users/adduser", { adminCode });
			setSuccess(true);
		} catch (err) {
			setError(err.response?.data?.error || "Failed to save admin code.");
		}
	};

	return (
		<div className="flex flex-col justify-between min-h-screen bg-gray-100">
			<div className="flex justify-center items-center flex-grow">
				<div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
					<h1 className="text-3xl font-semibold text-center mb-6 text-black">
						Set Admin Code
					</h1>

					{/* Error Message */}
					{error && <p className="text-red-500 text-center">{error}</p>}

					{/* Success Message */}
					{success && (
						<p className="text-green-500 text-center mb-4">
							Admin code saved successfully!
						</p>
					)}

					{/* Current Admin Code */}
					{currentCode && (
						<p className="text-center text-black mb-4">
							Current Admin Code: {currentCode}
						</p>
					)}

					{/* Form */}
					<form onSubmit={handleSubmit}>
						<div className="mb-4">
							<label className="block text-black font-semibold mb-2">
								Admin Code
							</label>
							<input
								type="text"
								className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
								placeholder="Enter admin code"
								value={adminCode}
								onChange={(e) => setAdminCode(e.target.value)}
								required
							/>
						</div>

						<button
							type="submit"
							className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
						>
							Save Admin Code
						</button>
					</form>
				</div>
			</div>

			{/* Admin Navbar */}
			<AdminNavbar />
		</div>
	);
}
