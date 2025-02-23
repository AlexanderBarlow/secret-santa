import jwt_decode from "jwt-decode";

import { createContext, useContext, useState, useEffect } from "react";
import { parseCookies } from "nookies";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const cookies = parseCookies();
		const token = cookies.token;

		if (token) {
			const base64Url = token.split(".")[1]; // Extract the payload
			const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
			const decoded = JSON.parse(atob(base64));
			setUser(decoded);
		}
	}, []);

	const login = (token) => {
		const decoded = jwt_decode(token);
		setUser(decoded);
		document.cookie = `token=${token}; path=/;`;
	};

	const logout = () => {
		setUser(null);
		document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	};

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
