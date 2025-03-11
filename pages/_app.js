import "../styles/globals.css";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import { useRouter } from "next/router";
import { appWithTranslation } from "next-i18next";
import i18n from "../pages/i18n";
import Head from "next/head";

// List of public pages
const publicPages = ["/auth/signin", "/auth/signup"];

function App({ Component, pageProps }) {
	const router = useRouter();
	const isPublicPage = publicPages.includes(router.pathname);

	return (
		<>
			<Head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, viewport-fit=cover"
				/>
				{/* PWA Manifest */}
				<link rel="manifest" href="/manifest.json" />
				<meta name="theme-color" content="#000000" />
				<link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
				<meta name="apple-mobile-web-app-title" content="My PWA App" />
			</Head>

			<div className="flex flex-col min-h-[100dvh] w-full pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] bg-white">
				<AuthProvider>
					{isPublicPage ? (
						<Component {...pageProps} />
					) : (
						<ProtectedRoute>
							<Component {...pageProps} />
						</ProtectedRoute>
					)}
				</AuthProvider>
			</div>
		</>
	);

}

export default appWithTranslation(App);
