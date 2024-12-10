import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function Layout({ children }) {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const router = useRouter();

	// Check if the user is logged in
	useEffect(() => {
		// Replace this with real logic (e.g., check cookies or local storage)
		const token = document.cookie.includes("auth_token");
		setIsLoggedIn(token);
	}, []);

	// Logout Handler
	const handleLogout = () => {
		// Clear authentication (e.g., remove token or clear session)
		document.cookie =
			"auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		router.push("/auth/signin"); // Redirect to login page
	};

	return (
		<div className="min-h-screen flex flex-col">
			{/* Navigation Bar */}
			<header className="w-full bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
				<h1 className="text-lg font-bold">My App</h1>
				{isLoggedIn && (
					<button
						className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
						onClick={handleLogout}
					>
						Logout
					</button>
				)}
			</header>

			{/* Page Content */}
			<main className="flex-grow">{children}</main>

			{/* Footer */}
			<footer className="w-full bg-gray-800 text-white py-4 text-center">
				<p>© 2024 My App</p>
			</footer>
		</div>
	);
}
