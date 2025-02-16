import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Correct import



export default function SignUp() {
	const [username, setUsername] = useState("");
	const [adminCode, setAdminCode] = useState("");
	const [password, setPassword] = useState(""); // New password state
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [isValidToken, setIsValidToken] = useState(null); // New state for token validation

	const router = useRouter();

	const handleSignUp = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const response = await axios.post("/api/auth/signup", {
				email: username, // Use email instead of username
				adminCode,
				password, // Pass password to API
			});

			if (response.data && response.data.token) {
				const { token } = response.data;

				// Store token in localStorage
				localStorage.setItem("token", token);
				console.log("Token stored:", token);

				// Decode token
				const decodedToken = jwtDecode(token);
				console.log("Decoded Token:", decodedToken);

				// Redirect based on role
				if (decodedToken.isAdmin) {
					router.push("/admin/dashboard");
				} else {
					router.push("/userdash");
				}
				
			} else {
				setError("Invalid email or password.");
			}
		} catch (err) {
			setError(err.response?.data?.error || "Signup failed. Try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
				<h1 className="text-3xl font-semibold text-center mb-6 text-black">
					Sign Up
				</h1>

				{/* Error Message */}
				{error && <p className="text-red-500 text-center">{error}</p>}

				<form onSubmit={handleSignUp} className="space-y-6">
					<div>
						<label className="block text-black font-semibold mb-2">Email</label>
						<input
							type="email"
							placeholder="Enter your email"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
							required
						/>
					</div>

					<div>
						<label className="block text-black font-semibold mb-2">
							Admin Code
						</label>
						<input
							type="text"
							placeholder="Enter the admin code"
							value={adminCode}
							onChange={(e) => setAdminCode(e.target.value)}
							className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
							required
						/>
					</div>

					<div>
						<label className="block text-black font-semibold mb-2">
							Password
						</label>
						<input
							type="password"
							placeholder="Enter your password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
							required
						/>
					</div>

					{/* Show loading spinner */}
					{loading && (
						<p className="text-center text-black">Creating account...</p>
					)}

					<button
						type="submit"
						className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
					>
						Create Account
					</button>
				</form>

				{/* Link to Login */}
				<p className="text-center mt-4 text-black">
					Already have an account?{" "}
					<Link href="/user/login" className="text-blue-500 hover:underline">
						Sign In Here
					</Link>
				</p>
			</div>
		</div>
	);
}
