import "../styles/globals.css";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import { useRouter } from "next/router";
import { appWithTranslation } from "next-i18next";
import Head from "next/head";

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
        <link rel="manifest" href="/manifest.json" />

        {/* Transparent theme for Android */}
        <meta name="theme-color" content="transparent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="CFA Secret Santa" />

        {/* Transparent bar for iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CFA Secret Santa" />
        <link rel="apple-touch-icon" href="/candy.jpg" />
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
