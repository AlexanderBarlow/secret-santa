import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookie from "js-cookie";

export default function ProtectedRoute({ children }) {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(null);
	const router = useRouter();

	useEffect(() => {
		// Check if there is a token in cookies
		const token = Cookie.get("token");

		if (!token) {
			// If no token is found, redirect to the sign-in page
			router.push("/auth/signin");
		} else {
			// Optionally, you can decode the token here to get user info
			setUser({ email: "admin@example.com" }); // Example user data, replace with real data
			setLoading(false);
		}
	}, [router]);

	if (loading) {
		return <div>Loading...</div>;
	}

	return <>{children}</>;
}
