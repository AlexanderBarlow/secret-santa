import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/languageswitcher";
import DownloadBtn from "../../components/DownloadBtn";

export default function SignIn() {
  const { t } = useTranslation();
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

        if (decodedToken.isAdmin) {
          setIsValidToken(true);
          router.push("/admin/dashboard");
        } else {
          setIsValidToken(true);
          router.push("/userdash");
        }
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
        setIsValidToken(false);
      }
    } else if (isValidToken === null) {
      setIsValidToken(false);
    }
  }, [isValidToken]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/auth/signin", {
        email,
        password,
      });

      if (response.data && response.data.token) {
        const { token } = response.data;
        localStorage.setItem("token", token);

        const decodedToken = jwtDecode(token);
        if (decodedToken.isAdmin) router.push("/admin/dashboard");
        else router.push("/userdash");
      } else {
        setError(t("invalid_credentials"));
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) setError(t("invalid_credentials"));
        else if (err.response.status === 500) setError(t("server_error"));
        else setError(t("unexpected_error"));
      } else {
        setError(t("network_error"));
      }
    } finally {
      setLoading(false);
    }
  };

  const navigateToCreateAccount = () => router.push("/auth/signup");

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-gradient-to-br from-[#f8f9fa] via-[#ffffff] to-[#e8edf5] pt-10 pb-12 px-4">
      {/* Language Switcher (Light Mode) */}
      <LanguageSwitcher theme="light" />

      {/* Optional PWA Download Button */}
      <div className="absolute top-3 left-3 z-50">
        <DownloadBtn />
      </div>

      {/* Logo */}
      <div className="flex justify-center mt-4 mb-6">
        <Image src="/logo.png" alt="Chick-fil-A Logo" width={180} height={70} />
      </div>

      {/* Frosted Sign-In Card */}
      <div className="w-full max-w-md p-8 bg-white/70 backdrop-blur-lg border border-white/40 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-900 drop-shadow-sm">
          {t("Sign In")}
        </h1>

        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              {t("Full Name")}
            </label>
            <input
              type="text"
              id="email"
              placeholder={t("John Doe")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 p-3 w-full border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              {t("Password")}
            </label>
            <input
              type="password"
              id="password"
              placeholder={t("••••••••")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 p-3 w-full border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center bg-red-100 py-2 rounded-md">
              {error}
            </p>
          )}

          {loading && (
            <p className="text-center text-gray-700">{t("loading_sign_in")}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 mt-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-md shadow-md hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold"
          >
            {t("SIGN IN")}
          </button>
        </form>

        <p className="text-center mt-5 text-gray-700 text-sm">
          {t("New User")}{" "}
          <span
            onClick={navigateToCreateAccount}
            className="text-red-600 font-medium hover:underline cursor-pointer"
          >
            {t("Sign Up Here")}
          </span>
        </p>
      </div>
    </div>
  );
}
