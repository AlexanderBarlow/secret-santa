import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Cookie from "js-cookie";
import Image from "next/image"; // Import next/image for optimized image handling

export default function SignIn() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();

	// Redirect to dashboard if token is present in cookies
	useEffect(() => {
		const token = Cookie.get("token");
		if (token) {
			router.push("/admin/dashboard");
		}
	}, [router]);

	const handleSignIn = async (e) => {
		e.preventDefault();

		try {
			// Send a POST request to authenticate the user
			const response = await axios.post(
				"http://localhost:3000/api/auth/signin",
				{
					email,
					password,
				}
			);

			// On successful login, store the JWT token in cookies
			if (response.data && response.data.token) {
				const { token, user } = response.data;
				Cookie.set("token", token, { expires: 1 }); // Store token with 1 day expiration
				Cookie.set("user", JSON.stringify(user), { expires: 1 }); // Store user info in cookies
				router.push("/admin/dashboard");
			} else {
				setError("Invalid email or password");
			}
		} catch (error) {
			setError("An error occurred. Please try again.");
		}
	};

	return (
		<div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
			{/* Chick-fil-A Logo */}
			<div className="flex justify-center mb-6">
				<Image
					src="/logo.png" // Path to your logo in the public folder
					alt="Chick-fil-A Logo"
					width={200} // Adjust the width according to your preference
					height={80} // Adjust the height according to your preference
				/>
			</div>

			{/* Sign In Form */}
			<div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
				<h1 className="text-3xl font-semibold text-center mb-6">Sign In</h1>
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
							className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
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
							className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
						/>
					</div>

					{error && (
						<p className="text-red-500 text-sm mt-2 text-center">{error}</p>
					)}

					<button
						type="submit"
						className="w-full py-3 mt-4 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
					>
						Sign In
					</button>
				</form>
			</div>
		</div>
	);
}
