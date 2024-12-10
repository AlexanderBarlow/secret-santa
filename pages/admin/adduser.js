import { useState } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";

export default function AddUser() {
	const [email, setEmail] = useState("");
	const [generatedUser, setGeneratedUser] = useState(null);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess(false);

		try {
			// Send the email to the API to create a new user
			const response = await axios.post("/api/admin/users/adduser", { email });
			setGeneratedUser(response.data);
			setSuccess(true);
		} catch (err) {
			setError(err.response?.data?.error || "Failed to add user.");
		}
	};

	return (
		<div className="flex flex-col justify-between min-h-screen bg-gray-100">
			<div className="flex justify-center items-center flex-grow">
				<div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
					<h1 className="text-3xl font-semibold text-center mb-6 text-black">
						Add New User
					</h1>

					{/* Error Message */}
					{error && <p className="text-red-500 text-center">{error}</p>}

					{/* Success Message */}
					{success && (
						<p className="text-green-500 text-center mb-4">
							User created successfully!
						</p>
					)}

					{/* Form */}
					<form onSubmit={handleSubmit}>
						<div className="mb-4">
							<label
								htmlFor="email"
								className="block text-black font-semibold mb-2"
							>
								Email Address
							</label>
							<input
								type="email"
								className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
								placeholder="Enter user email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<button
							type="submit"
							className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
						>
							Add User
						</button>
					</form>

					{/* Display generated user details */}
					{generatedUser && (
						<div className="mt-6">
							<h2 className="text-xl font-semibold text-black">User Details</h2>
							<p className="text-black">
								<strong>Email:</strong> {generatedUser.email}
							</p>
							<p className="text-black">
								<strong>Password:</strong> {generatedUser.password}
							</p>
							<button
								onClick={() => window.print()}
								className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
							>
								Print Details
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Admin Navbar */}
			<AdminNavbar />
		</div>
	);
}
