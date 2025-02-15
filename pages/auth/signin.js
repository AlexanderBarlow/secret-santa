import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Correct import
import Image from "next/image";

export default function SignIn() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false); // Add loading state
	const router = useRouter();
	const [isValidToken, setIsValidToken] = useState(null); // New state for token validation

	// Redirect if a valid token exists in localStorage
	useEffect(() => {
		const token = localStorage.getItem("token");

		// Only check token if it exists
		if (token && isValidToken === null) {
			try {
				const decodedToken = jwtDecode(token);

				// Check if token is expired
				if (decodedToken.exp * 1000 < Date.now()) {
					localStorage.removeItem("token");
					setIsValidToken(false); // Token is invalid
					return;
				}

				// Token is valid, check if the page is ready for redirection
				if (decodedToken.isAdmin) {
					setIsValidToken(true); // Admin token is valid
					router.push("/admin/dashboard");
				} else {
					setIsValidToken(true); // User token is valid
					router.push("/userdash");
				}
			} catch (err) {
				console.error("Invalid token:", err);
				localStorage.removeItem("token");
				setIsValidToken(false); // Invalid token
			}
		} else if (isValidToken === null) {
			setIsValidToken(false); // No token or valid token is null
		}
	}, [isValidToken]);

	const handleSignIn = async (e) => {
		e.preventDefault();
		setLoading(true); // Start loading

		try {
			const response = await axios.post(
				"http://localhost:3000/api/auth/signin",
				{ email, password }
			);

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
				} else if (decodedToken.changedPassword) {
					router.push("/userdash");
				} else {
					router.push("/user/changepassword");
				}
			} else {
				setError("Invalid email or password.");
			}
		} catch (err) {
			if (err.response) {
				if (err.response.status === 401) {
					setError("Invalid email or password.");
				} else if (err.response.status === 500) {
					setError("Server error. Please try again later.");
				} else {
					setError("An unexpected error occurred.");
				}
			} else {
				setError("Network error. Please check your connection.");
			}
		} finally {
			setLoading(false); // Stop loading
		}
	};

	// Function to navigate to the create account page
	const navigateToCreateAccount = () => {
		router.push("/auth/signup");
	};

	return (
		<div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
			<div className="flex justify-center mb-6">
				<Image src="/logo.png" alt="Chick-fil-A Logo" width={200} height={80} />
			</div>

			<div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
				<h1 className="text-3xl font-semibold text-center mb-6 text-black">Sign In</h1>
				<form onSubmit={handleSignIn} className="space-y-6">
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-600"
						>
							Email
						</label>
						<input
							type="email"
							id="email"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="mt-2 p-3 w-full border border-gray-300 rounded-md text-black"
							required
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-600"
						>
							Password
						</label>
						<input
							type="password"
							id="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="mt-2 p-3 w-full border border-gray-300 rounded-md text-black"
							required
						/>
					</div>

					{error && (
						<p className="text-red-500 text-sm mt-2 text-center">{error}</p>
					)}

					{/* Show loading spinner */}
					{loading && (
						<p className="text-center text-black">Sign In Page Loading...</p>
					)}

					<button
						type="submit"
						className="w-full py-3 mt-4 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600"
					>
						Sign In
					</button>
				</form>
				<p className="text-center mt-4 text-black">
					New User?{" "}
					<span
						onClick={navigateToCreateAccount}
						className="text-blue-500 hover:underline cursor-pointer"
					>
						Sign Up Here
					</span>
				</p>
			</div>
		</div>
	);
}
