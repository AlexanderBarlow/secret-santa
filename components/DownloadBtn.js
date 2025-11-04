"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Check, X } from "lucide-react";

export default function SmartPWAInstallButton({ theme = "auto" }) {
	const [installPrompt, setInstallPrompt] = useState(null);
	const [isInstalled, setIsInstalled] = useState(false);
	const [isDark, setIsDark] = useState(theme === "dark");
	const [justInstalled, setJustInstalled] = useState(false);
	const [showManualModal, setShowManualModal] = useState(false);

	// 🌗 Auto theme detection
	useEffect(() => {
		if (theme === "auto") {
			const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
			setIsDark(darkQuery.matches);
			const handleChange = (e) => setIsDark(e.matches);
			darkQuery.addEventListener("change", handleChange);
			return () => darkQuery.removeEventListener("change", handleChange);
		} else {
			setIsDark(theme === "dark");
		}
	}, [theme]);

	// 🧠 Detect install prompt and real installed state
	useEffect(() => {
		const handleBeforeInstallPrompt = (event) => {
			event.preventDefault();
			console.log("✅ beforeinstallprompt fired");
			setInstallPrompt(event);
		};
		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

		const handleAppInstalled = () => {
			setJustInstalled(true);
			localStorage.setItem("pwaInstalled", "true");
			setTimeout(() => setIsInstalled(true), 1600);
		};
		window.addEventListener("appinstalled", handleAppInstalled);

		// Check if running as standalone (true installed app)
		const checkStandalone = () => {
			const standalone =
				window.matchMedia("(display-mode: standalone)").matches ||
				window.navigator.standalone === true;
			if (standalone) setIsInstalled(true);
			else setIsInstalled(false);
		};

		checkStandalone();

		// Auto-reset flag if user uninstalled app but still has localStorage flag
		if (!window.matchMedia("(display-mode: standalone)").matches) {
			if (localStorage.getItem("pwaInstalled") === "true") {
				console.log("🧹 App uninstalled — resetting flag");
				localStorage.removeItem("pwaInstalled");
			}
		}

		return () => {
			window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
			window.removeEventListener("appinstalled", handleAppInstalled);
		};
	}, []);

	const handleInstall = async () => {
		if (installPrompt) {
			installPrompt.prompt();
			const choice = await installPrompt.userChoice;
			if (choice.outcome === "accepted") {
				console.log("✅ User accepted install");
				localStorage.setItem("pwaInstalled", "true");
				setJustInstalled(true);
				setTimeout(() => setIsInstalled(true), 1600);
			} else {
				console.log("❌ User dismissed install");
				localStorage.setItem("pwaDismissedAt", Date.now().toString());
			}
			setInstallPrompt(null);
		} else if (/iphone|ipad|ipod|macintosh/i.test(navigator.userAgent)) {
			setShowManualModal(true);
		} else {
			setShowManualModal(true);
		}
	};

	// 🧩 Hide only when truly running in standalone mode
	if (isInstalled) return null;

	return (
		<>
			{/* 💫 Floating install button */}
			<AnimatePresence>
				<motion.div
					key="install-btn"
					initial={{ opacity: 0, y: 30, scale: 0.9 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{
						opacity: 0,
						y: 20,
						scale: 0.8,
						transition: { duration: 0.6, ease: "easeInOut" },
					}}
					transition={{ duration: 0.45, ease: "easeOut" }}
					className="fixed bottom-5 right-5 z-50"
				>
					<motion.button
						onClick={handleInstall}
						className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold
              active:scale-95 overflow-hidden transition-all shadow-lg
              ${isDark
								? "bg-gradient-to-br from-[#3b82f6]/30 via-[#8b5cf6]/30 to-[#3b82f6]/30 text-white border border-white/20"
								: "bg-gradient-to-br from-[#4f46e5]/70 via-[#6366f1]/70 to-[#3b82f6]/70 text-white border border-white/30"
							}`}
						style={{
							WebkitBackdropFilter: "blur(14px)",
							backdropFilter: "blur(14px)",
						}}
					>
						{justInstalled ? (
							<motion.div
								initial={{ scale: 0, rotate: -45 }}
								animate={{ scale: 1, rotate: 0 }}
								transition={{ duration: 0.5, ease: "backOut" }}
							>
								<Check size={18} className="text-green-300 drop-shadow-lg" />
							</motion.div>
						) : (
							<Download
								size={16}
								className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
							/>
						)}
						<motion.span
							initial={false}
							animate={
								justInstalled
									? { scale: [1, 1.2, 0.9, 0], opacity: [1, 1, 0.8, 0] }
									: {}
							}
							transition={{ duration: 1.4, ease: "easeInOut" }}
							className="tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
						>
							{justInstalled ? "Installed!" : "Install App"}
						</motion.span>
					</motion.button>
				</motion.div>
			</AnimatePresence>

			{/* 📱 Manual-install modal */}
			<AnimatePresence>
				{showManualModal && (
					<motion.div
						className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999]"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<motion.div
							className="relative bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-xl w-[90%] max-w-sm text-center"
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
						>
							<button
								onClick={() => setShowManualModal(false)}
								className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
							>
								<X size={18} />
							</button>
							<h2 className="text-lg font-semibold mb-3">Install this app</h2>
							{/iphone|ipad|ipod|macintosh/i.test(navigator.userAgent) ? (
								<p className="text-sm text-gray-600 dark:text-gray-300">
									On iPhone or iPad:<br />
									1️⃣ Tap the <strong>Share</strong> icon<br />
									2️⃣ Choose <strong>Add to Home Screen</strong>
								</p>
							) : (
								<p className="text-sm text-gray-600 dark:text-gray-300">
									On Chrome or Edge:<br />
									1️⃣ Click the <strong>⋮</strong> or <strong>Install</strong> icon in the address bar.<br />
									2️⃣ Confirm to add it to your home screen.
								</p>
							)}
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
