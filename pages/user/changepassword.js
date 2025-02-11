import { useState } from "react";
import axios from "axios";

export default function ChangePassword() {
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		// Basic validation
		if (!currentPassword || !newPassword || !confirmPassword) {
			setError("All fields are required.");
			return;
		}

		if (newPassword.length < 6) {
			setError("New password must be at least 6 characters.");
			return;
		}

		if (newPassword !== confirmPassword) {
			setError("New passwords do not match.");
			return;
		}

		try {
			// Replace with your API endpoint
			const response = await axios.post("/api/auth/change-password", {
				currentPassword,
				newPassword,
			});

			if (response.status === 200) {
				setSuccess("Password changed successfully!");
				setCurrentPassword("");
				setNewPassword("");
				setConfirmPassword("");
			}
		} catch (err) {
			setError(err.response?.data?.error || "Failed to change password.");
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
				<h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
					Change Password
				</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Current Password */}
					<div>
						<label className="block text-sm font-medium text-gray-600">
							Current Password
						</label>
						<input
							type="password"
							value={currentPassword}
							onChange={(e) => setCurrentPassword(e.target.value)}
							className="w-full p-3 border border-gray-300 rounded-md mt-1"
							required
						/>
					</div>

					{/* New Password */}
					<div>
						<label className="block text-sm font-medium text-gray-600">
							New Password
						</label>
						<input
							type="password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							className="w-full p-3 border border-gray-300 rounded-md mt-1"
							required
						/>
					</div>

					{/* Confirm New Password */}
					<div>
						<label className="block text-sm font-medium text-gray-600">
							Confirm New Password
						</label>
						<input
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							className="w-full p-3 border border-gray-300 rounded-md mt-1"
							required
						/>
					</div>

					{/* Error Message */}
					{error && <p className="text-red-500 text-sm text-center">{error}</p>}

					{/* Success Message */}
					{success && (
						<p className="text-green-500 text-sm text-center">{success}</p>
					)}

					{/* Submit Button */}
					<button
						type="submit"
						className="w-full py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700"
					>
						Update Password
					</button>
				</form>
			</div>
		</div>
	);
}
