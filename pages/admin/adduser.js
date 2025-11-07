"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";
import { motion, AnimatePresence } from "framer-motion";
import {
	Loader2,
	CheckCircle2,
	Trash2,
	AlertTriangle,
	ShieldAlert,
} from "lucide-react";

export default function SetAdminCode() {
	const [adminCode, setAdminCode] = useState("");
	const [eventDate, setEventDate] = useState("");
	const [matchSantaDate, setMatchSantaDate] = useState("");
	const [overview, setOverview] = useState("");

	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState("");

	const [currentCode, setCurrentCode] = useState("");
	const [currentEventDate, setCurrentEventDate] = useState("");
	const [currentMatchSantaDate, setCurrentMatchSantaDate] = useState("");
	const [currentOverview, setCurrentOverview] = useState("");

	// === Fetch Admin Details ===
	useEffect(() => {
		const fetchAdminDetails = async () => {
			try {
				const { data } = await axios.get("/api/admin/users/adduser");
				const { code, eventDate, matchSantaDate, overview } = data;
				setCurrentCode(code);
				setCurrentEventDate(eventDate);
				setCurrentMatchSantaDate(matchSantaDate);
				setCurrentOverview(overview);
			} catch (err) {
				setError(err.response?.data?.error || "Failed to fetch admin details.");
			} finally {
				setLoading(false);
			}
		};
		fetchAdminDetails();
	}, []);

	// === Handle Save ===
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess(false);

		const updatedFields = {};
		if (adminCode.trim() && adminCode !== currentCode)
			updatedFields.adminCode = adminCode;
		if (eventDate.trim() && eventDate !== currentEventDate)
			updatedFields.eventDate = eventDate;
		if (matchSantaDate.trim() && matchSantaDate !== currentMatchSantaDate)
			updatedFields.matchSantaDate = matchSantaDate;
		if (overview.trim() && overview !== currentOverview)
			updatedFields.overview = overview;

		if (Object.keys(updatedFields).length === 0) {
			setError("No changes detected.");
			return;
		}

		try {
			await axios.post("/api/admin/users/adduser", updatedFields);
			setSuccess(true);
			setTimeout(() => setSuccess(false), 3000);

			const { data } = await axios.get("/api/admin/users/adduser");
			const { code, eventDate, matchSantaDate, overview } = data;
			setCurrentCode(code);
			setCurrentEventDate(eventDate);
			setCurrentMatchSantaDate(matchSantaDate);
			setCurrentOverview(overview);

			setAdminCode("");
			setEventDate("");
			setMatchSantaDate("");
			setOverview("");
		} catch (err) {
			setError(err.response?.data?.error || "Failed to save admin details.");
		}
	};

	// === Handle Clear All Data ===
	const handleClearData = async () => {
		const confirmDelete = confirm(
			"⚠️ WARNING: This will permanently delete all non-admin users, wishlists, and questions. Proceed?"
		);
		if (!confirmDelete) return;

		setMessage("Clearing database...");
		try {
			const res = await axios.delete("/api/admin/clearData", {
				data: { isAdmin: true },
			});
			setMessage(res.data.message || "All non-admin data cleared successfully.");
			setTimeout(() => setMessage(""), 4000);
		} catch (err) {
			console.error("Error clearing database:", err);
			setMessage("Error clearing database.");
		}
	};

	return (
		<div className="flex flex-col min-h-screen bg-gradient-to-br from-[#1a1a40] via-[#4054b2] to-[#1b1b2f] text-white relative pb-20">
			{/* Header */}
			<header className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-lg">
				<div className="max-w-5xl mx-auto flex justify-between items-center p-4 sm:p-5">
					<h1 className="text-xl sm:text-2xl font-bold drop-shadow-md">
						🧑‍💼 Admin Event Console
					</h1>
				</div>
			</header>

			{/* === Main Content === */}
			<main className="flex flex-col items-center justify-start flex-grow gap-8 p-6 sm:p-10 max-w-6xl mx-auto w-full">
				{/* 🚨 Danger Zone */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="w-full max-w-xl bg-gradient-to-br from-red-900/30 via-rose-800/25 to-transparent border border-red-400/40 backdrop-blur-lg rounded-xl shadow-[0_0_15px_rgba(255,0,0,0.2)] p-5 text-center"
				>
					<div className="flex flex-col items-center gap-2">
						<ShieldAlert className="w-8 h-8 text-red-400 animate-pulse" />
						<h2 className="text-xl font-semibold text-red-300">Danger Zone</h2>
						<p className="text-white/80 text-xs sm:text-sm max-w-sm">
							Delete all user data, wishlists, and questions —{" "}
							<strong className="text-red-300">except admin accounts</strong>.
						</p>

						<motion.button
							whileHover={{ scale: 1.06 }}
							whileTap={{ scale: 0.96 }}
							onClick={handleClearData}
							className="mt-3 flex items-center justify-center gap-2 w-full py-2.5
							bg-gradient-to-r from-red-600 via-rose-600 to-red-700 
							hover:from-red-500 hover:via-rose-500 hover:to-red-600
							border border-red-400/40 text-white text-sm font-semibold rounded-full
							shadow-[0_0_15px_rgba(255,0,0,0.4)] transition-all duration-300"
						>
							<motion.div
								animate={{ rotate: [0, -8, 8, 0] }}
								transition={{ repeat: Infinity, duration: 2 }}
							>
								<Trash2 className="w-4 h-4" />
							</motion.div>
							Clear All Data
						</motion.button>

						{message && (
							<div className="mt-2 flex items-center justify-center gap-1 text-xs text-red-200">
								<AlertTriangle className="w-3.5 h-3.5" /> {message}
							</div>
						)}
					</div>
				</motion.div>

				{/* 🌟 Overview + ✏️ Update Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
					{/* 🌟 Current Overview */}
					<motion.div
						initial={{ opacity: 0, y: 25 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						whileHover={{ scale: 1.01 }}
						className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl shadow-lg p-5 sm:p-6"
					>
						<h2 className="text-xl font-semibold text-center mb-4">
							🌟 Current Event
						</h2>

						{loading ? (
							<div className="flex justify-center items-center h-28">
								<Loader2 className="animate-spin w-6 h-6 text-white" />
							</div>
						) : (
							<div className="space-y-2 text-sm">
								<p>
									<strong className="opacity-80">Admin Code:</strong>{" "}
									<span className="text-red-400 font-bold">
										{currentCode || "Not Set"}
									</span>
								</p>
								<p>
									<strong className="opacity-80">Event Date:</strong>{" "}
									<span className="text-red-400 font-bold">
										{currentEventDate
											? new Date(currentEventDate).toLocaleDateString("en-US")
											: "Not Set"}
									</span>
								</p>
								<p>
									<strong className="opacity-80">Match Santa Date:</strong>{" "}
									<span className="text-red-400 font-bold">
										{currentMatchSantaDate
											? new Date(currentMatchSantaDate).toLocaleDateString("en-US")
											: "Not Set"}
									</span>
								</p>
								<p>
									<strong className="opacity-80">Overview:</strong>{" "}
									<span className="text-red-400 font-bold">
										{currentOverview || "Not Set"}
									</span>
								</p>
							</div>
						)}
					</motion.div>

					{/* ✏️ Update Form */}
					<motion.div
						initial={{ opacity: 0, y: 25 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						whileHover={{ scale: 1.01 }}
						className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl shadow-lg p-5 sm:p-6"
					>
						<h2 className="text-xl font-semibold text-center mb-4">
							✏️ Update Details
						</h2>

						{error && (
							<p className="text-red-400 text-center mb-2 font-medium text-sm">
								{error}
							</p>
						)}

						<form onSubmit={handleSubmit} className="space-y-3 text-sm">
							<div className="flex flex-col">
								<label className="font-semibold mb-1">Admin Code</label>
								<input
									type="text"
									placeholder={currentCode || "Enter new code"}
									value={adminCode}
									onChange={(e) => setAdminCode(e.target.value)}
									className="p-2.5 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:ring-2 focus:ring-white/40 outline-none transition"
								/>
							</div>

							<div className="flex flex-col">
								<label className="font-semibold mb-1">Event Date</label>
								<input
									type="date"
									value={eventDate}
									onChange={(e) => setEventDate(e.target.value)}
									className="p-2.5 rounded-lg bg-white/20 border border-white/30 text-white focus:ring-2 focus:ring-white/40 outline-none transition"
								/>
							</div>

							<div className="flex flex-col">
								<label className="font-semibold mb-1">Match Santa Date</label>
								<input
									type="date"
									value={matchSantaDate}
									onChange={(e) => setMatchSantaDate(e.target.value)}
									className="p-2.5 rounded-lg bg-white/20 border border-white/30 text-white focus:ring-2 focus:ring-white/40 outline-none transition"
								/>
							</div>

							<div className="flex flex-col">
								<label className="font-semibold mb-1">Overview</label>
								<textarea
									placeholder={currentOverview || "Enter event overview"}
									value={overview}
									onChange={(e) => setOverview(e.target.value)}
									rows={3}
									className="p-2.5 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:ring-2 focus:ring-white/40 outline-none transition resize-none"
								/>
							</div>

							<motion.button
								whileHover={{ scale: 1.04 }}
								whileTap={{ scale: 0.96 }}
								type="submit"
								className="w-full py-2.5 bg-red-500/70 hover:bg-red-600/90 rounded-full font-semibold text-white shadow-lg transition-all duration-300"
							>
								Save Details
							</motion.button>
						</form>
					</motion.div>
				</div>
			</main>

			{/* ✅ Floating Toast */}
			<AnimatePresence>
				{success && (
					<motion.div
						initial={{ opacity: 0, y: 60 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 60 }}
						transition={{ duration: 0.4 }}
						className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/30 px-5 py-3 rounded-full shadow-lg flex items-center gap-2 text-white font-medium"
					>
						<CheckCircle2 className="text-green-400" />
						<span>Admin details saved successfully!</span>
					</motion.div>
				)}
			</AnimatePresence>

			<AdminNavbar />
		</div>
	);
}
