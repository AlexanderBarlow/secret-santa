import { createContext, useContext, useState, useEffect } from "react";
import { parseCookies } from "nookies";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		// Get the user from cookies or localStorage
		const cookies = parseCookies();
		const token = cookies.auth_token; // Assuming your token is stored in cookies

		if (token) {
			// If token exists, you might want to fetch user data from your API
			// or decode the token to get user information
			setUser({ email: "user@example.com" }); // Example user data
		}
	}, []);

	const login = (userData) => {
		// Set user and token here, store them in cookies or session storage
		setUser(userData);
	};

	const logout = () => {
		// Clear the user and token on logout
		setUser(null);
		document.cookie =
			"auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	};

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
