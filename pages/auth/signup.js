"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import LanguageSwitcher from "../../components/languageswitcher";

export default function SignUp() {
	const { t } = useTranslation("common");
	const [username, setUsername] = useState("");
	const [adminCode, setAdminCode] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState("FRONT_OF_HOUSE");
	const [selectedProfile, setSelectedProfile] = useState(null);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [isClient, setIsClient] = useState(false);
	const router = useRouter();

	const profileImages = ["/cow1.jpg", "/cow2.jpg", "/cow3.jpg"];

	useEffect(() => {
		setIsClient(true);
	}, []);

	const handleSignUp = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		if (!selectedProfile) {
			setError(t("select_profile_picture"));
			setLoading(false);
			return;
		}

		try {
			const response = await axios.post("/api/auth/signup", {
				email: username,
				adminCode,
				password,
				role,
				profilePicture: selectedProfile,
			});

			if (response.data?.token) {
				const { token } = response.data;
				localStorage.setItem("token", token);
				const decoded = jwtDecode(token);
				router.push(decoded.isAdmin ? "/admin/dashboard" : "/userdash");
			} else {
				setError(t("invalid_signup_response"));
			}
		} catch (err) {
			setError(err.response?.data?.error || t("signup_failed"));
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-[#1a1a40] via-[#4054b2] to-[#1b1b2f] text-white overflow-hidden">
			{/* 🌐 Language toggle */}
			<div className="absolute top-3 right-3 z-50">
				<LanguageSwitcher theme="dark" />
			</div>

			{/* ❄️ Snow only client-side */}
			{isClient && (
				<div className="absolute inset-0 pointer-events-none overflow-hidden">
					{[...Array(25)].map((_, i) => (
						<motion.span
							key={i}
							className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-50 blur-[1px]"
							initial={{ y: -10, x: Math.random() * window.innerWidth }}
							animate={{
								y: "110vh",
								x: `+=${(Math.random() - 0.5) * 50}`,
								opacity: [0.8, 0.3, 0.8],
							}}
							transition={{
								duration: 10 + Math.random() * 8,
								repeat: Infinity,
								ease: "linear",
								delay: Math.random() * 4,
							}}
						/>
					))}
				</div>
			)}

			{/* 🎄 Sign-up Card */}
			<motion.div
				initial={{ opacity: 0, scale: 0.95, y: 20 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="relative z-10 w-[90%] max-w-md p-8 rounded-2xl shadow-2xl border border-white/30 bg-white/10 backdrop-blur-2xl"
			>
				<h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-red-400 via-pink-300 to-green-400 bg-clip-text text-transparent">
					{t("create_account_title")}
				</h1>

				{error && (
					<p className="text-red-400 text-center font-medium mb-4">{error}</p>
				)}

				{/* Profile Selection */}
				<div className="mb-6 text-center">
					<h2 className="font-semibold mb-3 text-white/90">
						{t("choose_profile_picture")}
					</h2>
					<div className="flex justify-center space-x-4">
						{profileImages.map((img, idx) => (
							<motion.button
								key={idx}
								whileHover={{ scale: 1.1 }}
								onClick={() => setSelectedProfile(img)}
								className={`p-1 rounded-full border-2 transition-all duration-300 ${selectedProfile === img
										? "border-red-400 scale-110 shadow-[0_0_15px_rgba(255,255,255,0.6)]"
										: "border-white/30"
									}`}
							>
								<img
									src={img}
									alt="Profile"
									className="w-16 h-16 rounded-full object-cover"
								/>
							</motion.button>
						))}
					</div>
				</div>

				{/* Form */}
				<form onSubmit={handleSignUp} className="space-y-5">
					<div>
						<label className="block text-sm font-semibold mb-1 text-white/90">
							{t("full_name")}
						</label>
						<input
							type="text"
							placeholder={t("enter_full_name")}
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="w-full p-3 rounded-lg bg-white/15 border border-white/30 text-white placeholder-white/60 focus:ring-2 focus:ring-red-400 outline-none"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-semibold mb-1 text-white/90">
							{t("event_code")}
						</label>
						<input
							type="text"
							placeholder={t("enter_event_code")}
							value={adminCode}
							onChange={(e) => setAdminCode(e.target.value)}
							className="w-full p-3 rounded-lg bg-white/15 border border-white/30 text-white placeholder-white/60 focus:ring-2 focus:ring-green-400 outline-none"
							required
						/>
						<p className="text-xs mt-1 text-white/60">
							{t("provided_by_organizer")}
						</p>
					</div>

					<div>
						<label className="block text-sm font-semibold mb-1 text-white/90">
							{t("password")}
						</label>
						<input
							type="password"
							placeholder={t("create_password")}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full p-3 rounded-lg bg-white/15 border border-white/30 text-white placeholder-white/60 focus:ring-2 focus:ring-blue-400 outline-none"
							required
						/>
					</div>

					{/* Role Selection */}
					<div>
						<label className="block text-sm font-semibold mb-2 text-white/90">
							{t("select_role")}
						</label>
						<div className="flex gap-3">
							{[
								{ label: t("front_of_house"), value: "FRONT_OF_HOUSE", color: "red" },
								{ label: t("back_of_house"), value: "BACK_OF_HOUSE", color: "blue" },
							].map((option) => (
								<motion.button
									key={option.value}
									type="button"
									whileTap={{ scale: 0.95 }}
									onClick={() => setRole(option.value)}
									className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border-2 transition-all duration-300 ${role === option.value
											? `border-${option.color}-400 bg-${option.color}-400/20 text-${option.color}-200`
											: "border-white/30 bg-white/10 text-white/80 hover:bg-white/20"
										}`}
								>
									{option.label}
								</motion.button>
							))}
						</div>
					</div>

					{loading ? (
						<div className="flex justify-center items-center gap-2 text-white/80">
							<Loader2 className="animate-spin w-4 h-4" />
							<span>{t("creating_account")}</span>
						</div>
					) : (
						<motion.button
							whileHover={{ scale: 1.03 }}
							whileTap={{ scale: 0.95 }}
							type="submit"
							className="w-full mt-4 py-3 rounded-full font-semibold bg-gradient-to-r from-red-500 via-pink-400 to-green-400 text-white shadow-lg hover:shadow-xl transition-all"
						>
							{t("create_account_button")}
						</motion.button>
					)}
				</form>

				<p className="text-center mt-6 text-white/80 text-sm">
					{t("already_have_account")}{" "}
					<Link href="/auth/signin" className="text-pink-300 hover:underline">
						{t("sign_in_here")}
					</Link>
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
