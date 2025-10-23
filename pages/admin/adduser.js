"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function SetAdminCode() {
	const [adminCode, setAdminCode] = useState("");
	const [eventDate, setEventDate] = useState("");
	const [matchSantaDate, setMatchSantaDate] = useState("");
	const [overview, setOverview] = useState("");

	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(true);

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
			setTimeout(() => setSuccess(false), 3000); // auto-hide toast

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

	return (
		<div className="flex flex-col min-h-screen bg-gradient-to-br from-[#1a1a40] via-[#4054b2] to-[#1b1b2f] text-white relative">
			{/* Header */}
			<header className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-lg">
				<div className="max-w-5xl mx-auto flex justify-between items-center p-4 sm:p-5">
					<h1 className="text-xl sm:text-2xl font-bold drop-shadow-md">
						🧑‍💼 Admin Event Console
					</h1>
				</div>
			</header>

			<main className="flex flex-col items-center justify-center flex-grow gap-10 p-6 sm:p-10 max-w-6xl mx-auto w-full">
				{/* === Current Event Details Card === */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					whileHover={{ scale: 1.02, rotateX: 1 }}
					className="w-full max-w-xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-6 sm:p-8"
				>
					<h2 className="text-2xl font-semibold text-center mb-6 drop-shadow-md">
						🌟 Current Event Overview
					</h2>

					{loading ? (
						<div className="flex justify-center items-center h-32">
							<Loader2 className="animate-spin w-6 h-6 text-white" />
						</div>
					) : (
						<div className="text-center space-y-4">
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
										? new Date(currentEventDate).toLocaleDateString("en-US", {
											year: "numeric",
											month: "long",
											day: "numeric",
										})
										: "Not Set"}
								</span>
							</p>
							<p>
								<strong className="opacity-80">Match Santa Date:</strong>{" "}
								<span className="text-red-400 font-bold">
									{currentMatchSantaDate
										? new Date(currentMatchSantaDate).toLocaleDateString("en-US", {
											year: "numeric",
											month: "long",
											day: "numeric",
										})
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

				{/* === Update Form === */}
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7 }}
					whileHover={{ scale: 1.02, rotateX: 1 }}
					className="w-full max-w-xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-6 sm:p-8"
				>
					<h2 className="text-2xl font-semibold text-center mb-6 drop-shadow-md">
						✏️ Update Admin Details
					</h2>

					{error && (
						<p className="text-red-400 text-center mb-4 font-medium">{error}</p>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="flex flex-col">
							<label className="font-semibold mb-1 text-sm">Admin Code</label>
							<input
								type="text"
								placeholder={currentCode || "Enter new code"}
								value={adminCode}
								onChange={(e) => setAdminCode(e.target.value)}
								className="p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 outline-none transition"
							/>
						</div>

						<div className="flex flex-col">
							<label className="font-semibold mb-1 text-sm">Event Date</label>
							<input
								type="date"
								value={eventDate}
								onChange={(e) => setEventDate(e.target.value)}
								className="p-3 rounded-lg bg-white/20 border border-white/30 text-white focus:ring-2 focus:ring-white/50 outline-none transition"
							/>
						</div>

						<div className="flex flex-col">
							<label className="font-semibold mb-1 text-sm">Match Santa Date</label>
							<input
								type="date"
								value={matchSantaDate}
								onChange={(e) => setMatchSantaDate(e.target.value)}
								className="p-3 rounded-lg bg-white/20 border border-white/30 text-white focus:ring-2 focus:ring-white/50 outline-none transition"
							/>
						</div>

						<div className="flex flex-col">
							<label className="font-semibold mb-1 text-sm">Overview</label>
							<textarea
								placeholder={currentOverview || "Enter event overview"}
								value={overview}
								onChange={(e) => setOverview(e.target.value)}
								rows={4}
								className="p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 outline-none transition resize-none"
							/>
						</div>

						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							type="submit"
							className="w-full py-3 bg-red-500/70 hover:bg-red-600/90 rounded-full font-semibold text-white shadow-lg transition-all duration-300"
						>
							Save Admin Details
						</motion.button>
					</form>
				</motion.div>
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
