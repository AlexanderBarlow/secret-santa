import { useState, useEffect } from "react";
import axios from "axios";

export default function UserDashboard() {
	const [user, setUser] = useState(null);
	const [wishlist, setWishlist] = useState([]); // ✅ Always initialized as an array
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const token = localStorage.getItem("token");

				const userResponse = await axios.get("/api/userinfo", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				setUser(userResponse.data);
				setWishlist(userResponse.data.wishlist || []); // ✅ Ensure it's always an array
			} catch (error) {
				console.error("Error fetching data:", error);
				setError("There was an error fetching your data. Please try again.");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const exampleWishlist = ["Gift Card", "Headphones", "Book", "Chocolate Box"];

	return (
		<div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-red-500 to-red-700 text-white py-6">
			{/* Header */}
			<header className="w-full text-center py-5 shadow-md">
				<h1 className="text-3xl font-bold tracking-wide">
					Secret Santa Dashboard
				</h1>
			</header>

			<main className="w-full max-w-4xl p-6 bg-white text-gray-900 rounded-xl shadow-lg mt-6">
				{/* Error Message */}
				{error && (
					<div className="bg-red-100 text-red-600 p-3 rounded-md text-center mb-4">
						<p>{error}</p>
					</div>
				)}

				{/* Loading State */}
				{loading ? (
					<div className="text-center text-gray-600 text-lg">Loading...</div>
				) : (
					<>
						{/* User Info */}
						{user && (
							<div className="mb-6 text-center">
								<h2 className="text-2xl font-semibold text-gray-800">
									Welcome, {user.name}! 🎄
								</h2>
								<p className="text-gray-600 mt-1">Email: {user.email}</p>
							</div>
						)}

						{/* User Wishlist */}
						<div className="mt-6">
							<h3 className="text-xl font-semibold text-gray-800 text-center">
								Your Wishlist 🎁
							</h3>
							<div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
								{wishlist.length > 0
									? wishlist.map((item, index) => (
											<div
												key={index}
												className="p-4 bg-gray-100 rounded-lg shadow text-center"
											>
												<span className="text-gray-700 font-medium">
													{item}
												</span>
											</div>
									  ))
									: exampleWishlist.map((item, index) => (
											<div
												key={index}
												className="p-4 bg-gray-200 rounded-lg shadow text-center"
											>
												<span className="text-gray-500 italic">
													Example: {item}
												</span>
											</div>
									  ))}
							</div>
							{wishlist.length === 0 && (
								<p className="text-center text-gray-500 mt-2">
									Your wishlist is empty! Here are some ideas.
								</p>
							)}
						</div>
					</>
				)}
			</main>
		</div>
	);
}
