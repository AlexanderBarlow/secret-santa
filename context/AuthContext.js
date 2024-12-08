import { createContext, useContext, useState, useEffect } from "react";
import Cookie from "js-cookie";
import { useRouter } from "next/router";

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null); // Authentication state
	const router = useRouter();

	const login = (userData) => {
		setUser(userData); // Save user data on login
		Cookie.set("user", JSON.stringify(userData)); // Store in cookie
	};

	const logout = () => {
		setUser(null); // Clear user data on logout
		Cookie.remove("user"); // Remove user cookie
		router.push("/auth/signin"); // Redirect to sign-in page
	};

	// Check cookie for user data on mount (useful for refreshes)
	useEffect(() => {
		const savedUser = Cookie.get("user");

		if (savedUser) {
			try {
				setUser(JSON.parse(savedUser)); // Parse JSON safely
			} catch (error) {
				console.error("Error parsing user data from cookie:", error);
				Cookie.remove("user"); // Remove invalid cookie if parsing fails
			}
		}
	}, []);

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
