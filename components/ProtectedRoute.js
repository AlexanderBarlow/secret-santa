import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookie from "js-cookie";

export default function ProtectedRoute({ children }) {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(null);
	const router = useRouter();

	useEffect(() => {
		// Check if there is a token in localStorage
		const token = localStorage.getItem("token");

		// If there's no token, redirect to the sign-in page
		if (!token) {
			// Redirect only if we're not already on the sign-in page
			if (router.pathname !== "/auth/signin") {
				router.push("/auth/signin");
			} else {
				setLoading(false); // Stop loading if we're already on the sign-in page
			}
		} else {
			// Optionally, decode the token and get user data
			setUser({ email: "admin@example.com" }); // Example user data, replace with real data
			setLoading(false);
		}
	}, [router.pathname]); // Only re-run the effect if the pathname changes

	if (loading) {
		return <div>Protected Route Loading...</div>;
	}

	return <>{children}</>;
}
