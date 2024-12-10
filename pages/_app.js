import "../styles/globals.css";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import { useRouter } from "next/router";

// List of public pages
const publicPages = ["/auth/signin", "/auth/signup"];

export default function App({ Component, pageProps }) {
	const router = useRouter();
	const isPublicPage = publicPages.includes(router.pathname);

	return (
		<AuthProvider>
			{isPublicPage ? (
				<Component {...pageProps} />
			) : (
				<ProtectedRoute>
					<Component {...pageProps} />
				</ProtectedRoute>
			)}
		</AuthProvider>
	);
}
