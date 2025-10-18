import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/languageswitcher";
import DownloadBtn from '../../components/DownloadBtn';

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
			const response = await axios.post(
				"/api/auth/signin",
				{ email, password }
			);

			if (response.data && response.data.token) {
				const { token } = response.data;

				localStorage.setItem("token", token);
				console.log("Token stored:", token);

				const decodedToken = jwtDecode(token);
				console.log("Decoded Token:", decodedToken);

				if (decodedToken.isAdmin) {
					router.push("/admin/dashboard");
				} else if (!decodedToken.isAdmin) {
					router.push("/userdash");
				}
			} else {
				setError(t("invalid_credentials"));
			}
		} catch (err) {
			if (err.response) {
				if (err.response.status === 401) {
					setError(t("invalid_credentials"));
				} else if (err.response.status === 500) {
					setError(t("server_error"));
				} else {
					setError(t("unexpected_error"));
				}
			} else {
				setError(t("network_error"));
			}
		} finally {
			setLoading(false);
		}
	};

	const navigateToCreateAccount = () => {
		router.push("/auth/signup");
	};

	return (
		<div className="flex flex-col justify-center items-center min-h-dvh h-full">
			<DownloadBtn />
			<LanguageSwitcher />
			<div className="flex justify-center mb-3">
				<Image src="/logo.png" alt="Chick-fil-A Logo" width={200} height={80} />
			</div>
			<div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
				<h1 className="text-3xl font-semibold text-center mb-6 text-black">
					{t("Sign In")}
				</h1>
				<form onSubmit={handleSignIn} className="space-y-6">
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-600"
						>
							{t("Full Name")}
						</label>
						<input
							type="text"
							id="email"
							placeholder={t("John Doe")}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="mt-2 p-3 w-full border border-gray-300 rounded-md text-black"
							required
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-600"
						>
							{t("Password")}
						</label>
						<input
							type="password"
							id="password"
							placeholder={t("")}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="mt-2 p-3 w-full border border-gray-300 rounded-md text-black"
							required
						/>
					</div>

					{error && (
						<p className="text-red-500 text-sm mt-2 text-center">{error}</p>
					)}

					{loading && (
						<p className="text-center text-black">{t("loading_sign_in")}</p>
					)}

					<button
						type="submit"
						className="w-full py-3 mt-4 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600"
					>
						{t("SIGN IN")}
					</button>
				</form>
				<p className="text-center mt-4 text-black">
					{t("New User")}{" "}
					<span
						onClick={navigateToCreateAccount}
						className="text-blue-500 hover:underline cursor-pointer"
					>
						{t("Sign Up Here")}
					</span>
				</p>
			</div>
		</div>
	);
}
