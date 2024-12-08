import "../styles/globals.css";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";

// List of public pages
const publicPages = ["/auth/signin"];

export default function App({ Component, pageProps, router }) {
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
