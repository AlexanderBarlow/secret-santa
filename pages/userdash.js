import { useState, useEffect } from "react";
import axios from "axios";

export default function UserDashboard() {
	const [user, setUser] = useState(null); // Holds user data
	const [wishlist, setWishlist] = useState([]); // Wishlist items
	const [loading, setLoading] = useState(true); // Loading state
	const [error, setError] = useState(""); // Error state

	useEffect(() => {
		// Fetch user info
		const fetchData = async () => {
			try {
				setLoading(true);
				const token = localStorage.getItem("token");

				const userResponse = await axios.get("/api/userinfo", {
					headers: {
						Authorization: `Bearer ${token}`, // Add the token to the request headers
					},
				});

				setUser(userResponse.data);
				setWishlist(userResponse.data.wishlist); // Assuming user has a wishlist attribute
			} catch (error) {
				console.error("Error fetching data:", error);
				setError("There was an error fetching your data. Please try again.");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	return (
		<div className="flex flex-col items-center min-h-screen bg-gray-100 py-6">
			{/* Header */}
			<header className="w-full bg-red-500 text-white py-4 shadow-md">
				<h1 className="text-center text-2xl font-bold">
					Secret Santa Dashboard
				</h1>
			</header>

			<main className="w-full max-w-4xl p-4 bg-white rounded-lg shadow-lg mt-6">
				{/* Error Message */}
				{error && (
					<div className="text-red-500 text-center mb-4">
						<p>{error}</p>
					</div>
				)}

				{/* Loading State */}
				{loading ? (
					<div className="text-center text-gray-600">Loading...</div>
				) : (
					<>
						{/* User Info */}
						{user && (
							<div className="mb-6">
								<h2 className="text-xl font-semibold text-gray-800 mb-2">
									Welcome, {user.name}!
								</h2>
								<p className="text-gray-600">Email: {user.email}</p>
							</div>
						)}

						{/* User Wishlist */}
						<div>
							<h3 className="text-xl font-semibold text-gray-800">
								Your Wishlist:
							</h3>
							<ul className="list-disc pl-6 mt-2">
								{user && user.wishlist && user.wishlist.length > 0 ? (
									user.wishlist.map((item, index) => (
										<li key={index} className="text-gray-700">
											{item}
										</li>
									))
								) : (
									<li className="text-gray-500">No items in your wishlist.</li>
								)}
							</ul>
						</div>
					</>
				)}
			</main>
		</div>
	);
}
