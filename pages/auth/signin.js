"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import LanguageSwitcher from "../../components/languageswitcher";
import DownloadBtn from "../../components/DownloadBtn";
import { motion } from "framer-motion";

export default function SignIn() {
  const { t } = useTranslation("common");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isValidToken, setIsValidToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && isValidToken === null) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          setIsValidToken(false);
          return;
        }

        if (decodedToken.isAdmin) router.push("/admin/dashboard");
        else router.push("/userdash");
        setIsValidToken(true);
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
        setIsValidToken(false);
      }
    } else if (isValidToken === null) setIsValidToken(false);
  }, [isValidToken, router]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/signin", { email, password });
      const { token } = res.data;
      if (!token) throw new Error("Invalid token");
      localStorage.setItem("token", token);
      const decodedToken = jwtDecode(token);
      decodedToken.isAdmin
        ? router.push("/admin/dashboard")
        : router.push("/userdash");
    } catch (err) {
      setError(
        err.response?.status === 401
          ? t("invalid_credentials")
          : err.response?.status === 500
            ? t("server_error")
            : t("network_error")
      );
    } finally {
      setLoading(false);
    }
  };

  const navigateToCreateAccount = () => router.push("/auth/signup");

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[100dvh] w-full bg-gradient-to-br from-[#f9fafb] via-[#ffffff] to-[#eaf0fa] text-gray-900 overflow-hidden">
      {/* Subtle background ornaments */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
      </div>

      {/* Language + PWA */}
      <div className="absolute top-3 right-3 flex gap-3 z-50">
        <LanguageSwitcher theme="light" />
        <DownloadBtn />
      </div>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-center mb-6 mt-6"
      >
        <Image src="/logo.png" alt="Chick-fil-A Logo" width={180} height={70} />
      </motion.div>

      {/* Sign-in Card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-[90%] sm:w-[400px] p-8 rounded-3xl bg-white/60 backdrop-blur-2xl border border-white/30 shadow-[0_8px_30px_rgba(0,0,0,0.12)] z-10"
      >
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-900">
          {t("Sign In")}
        </h1>

        <form onSubmit={handleSignIn} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              {t("Full Name")}
            </label>
            <input
              id="email"
              type="text"
              placeholder={t("John Doe")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              {t("Password")}
            </label>
            <input
              id="password"
              type="password"
              placeholder={t("••••••••")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              required
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center bg-red-100 py-2 rounded-md">
              {error}
            </p>
          )}
          {loading && <p className="text-center text-gray-600">{t("loading_sign_in")}</p>}

          <motion.button
            whileHover={{ scale: 1.03, backgroundColor: "#dc2626" }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full py-3 rounded-full font-semibold bg-gradient-to-r from-red-500/80 to-red-600/80 text-white shadow-lg backdrop-blur-md border border-white/20 hover:shadow-xl transition"
          >
            {t("SIGN IN")}
          </motion.button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-700">
          {t("New User")}{" "}
          <span
            onClick={navigateToCreateAccount}
            className="text-red-600 font-medium hover:underline cursor-pointer"
          >
            {t("Sign Up Here")}
          </span>
        </p>
      </motion.div>
    </div>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

