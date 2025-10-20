import "../styles/globals.css";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import { useRouter } from "next/router";
import { appWithTranslation } from "next-i18next";
import Head from "next/head";
import { useEffect } from "react";

const publicPages = ["/auth/signin", "/auth/signup"];

function App({ Component, pageProps }) {
  const router = useRouter();
  const isPublicPage = publicPages.includes(router.pathname);

  // Register service worker for PWA
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((err) =>
          console.error("Service Worker registration failed:", err)
        );
    }
  }, []);

  return (
    <>
      <Head>
        {/* Core PWA Meta */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1a1a40" />

        {/* Android */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="CFA Secret Santa" />

        {/* iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="CFA Secret Santa" />
        <link rel="apple-touch-icon" href="/candy.jpg" />

        {/* Smooth scrolling on iOS standalone mode */}
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </Head>

      {/* Root layout wrapper */}
      <div className="relative min-h-[100dvh] w-full overflow-x-hidden overflow-y-auto text-white bg-gradient-to-br from-[#1a1a40] via-[#4054b2] to-[#1b1b2f] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
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
