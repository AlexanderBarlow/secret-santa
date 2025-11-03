"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Check } from "lucide-react";

export default function PWAInstallButton({ theme = "auto" }) {
	const [installPrompt, setInstallPrompt] = useState(null);
	const [isInstalled, setIsInstalled] = useState(false);
	const [isDark, setIsDark] = useState(theme === "dark");
	const [justInstalled, setJustInstalled] = useState(false);

	// Capture beforeinstallprompt
	useEffect(() => {
		const handleBeforeInstallPrompt = (event) => {
			event.preventDefault();
			setInstallPrompt(event);
		};

		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

		// Detect if already installed (display-mode or stored flag)
		if (
			window.matchMedia("(display-mode: standalone)").matches ||
			localStorage.getItem("pwaInstalled") === "true"
		) {
			setIsInstalled(true);
		}

		// Detect "appinstalled" event
		const handleAppInstalled = () => {
			localStorage.setItem("pwaInstalled", "true");
			setJustInstalled(true);
			setTimeout(() => setIsInstalled(true), 1600);
		};

		window.addEventListener("appinstalled", handleAppInstalled);

		return () => {
			window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
			window.removeEventListener("appinstalled", handleAppInstalled);
		};
	}, []);

	// Theme detection
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

	const handleInstall = () => {
		if (!installPrompt) return;
		installPrompt.prompt();
		installPrompt.userChoice.then((choice) => {
			setInstallPrompt(null);
			if (choice.outcome === "accepted") {
				localStorage.setItem("pwaInstalled", "true");
				setJustInstalled(true);
				setTimeout(() => setIsInstalled(true), 1600);
			}
		});
	};

	// ✅ Hide if installed or not available
	if (isInstalled || !installPrompt) return null;

	return (
		<AnimatePresence>
			{!isInstalled && (
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
						disabled={!installPrompt}
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
						{/* Sparkle stars */}
						<div className="absolute inset-0 overflow-hidden pointer-events-none">
							{[...Array(4)].map((_, i) => (
								<motion.span
									key={i}
									className="absolute w-[6px] h-[6px] rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.7)]"
									style={{
										top: `${Math.random() * 100}%`,
										left: `${Math.random() * 100}%`,
									}}
									animate={{
										opacity: [0, 1, 0],
										scale: [0, 1.5, 0],
										rotate: [0, 45, 90],
									}}
									transition={{
										duration: 2.8,
										repeat: Infinity,
										delay: i * 0.8,
										ease: "easeInOut",
									}}
								/>
							))}
						</div>

						{/* Icon */}
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

						{/* Text */}
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
			)}
		</AnimatePresence>
	);
}
