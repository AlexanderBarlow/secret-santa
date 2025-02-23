import "../styles/globals.css";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import { useRouter } from "next/router";
import { appWithTranslation } from "next-i18next";
import i18n from "../pages/i18n";

// List of public pages
const publicPages = ["/auth/signin", "/auth/signup"];

function App({ Component, pageProps }) {
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

export default appWithTranslation(App); // Wrap the app with the translation HOC
