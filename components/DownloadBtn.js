import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";

export default function PWAInstallButton({ theme = "auto" }) {
	const [installPrompt, setInstallPrompt] = useState(null);
	const [isInstalled, setIsInstalled] = useState(false);
	const [isDark, setIsDark] = useState(theme === "dark");

	// Listen for install prompt
	useEffect(() => {
		const handleBeforeInstallPrompt = (event) => {
			event.preventDefault();
			setInstallPrompt(event);
			console.log("✅ PWA install prompt available");
		};

		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
		return () => {
			window.removeEventListener(
				"beforeinstallprompt",
				handleBeforeInstallPrompt
			);
		};
	}, []);

	// Check if app is installed
	useEffect(() => {
		if (window.matchMedia("(display-mode: standalone)").matches) {
			setIsInstalled(true);
		}
	}, []);

	// Auto theme detection
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
				console.log("✅ PWA installed successfully");
				setIsInstalled(true);
			} else {
				console.log("❌ PWA installation declined");
			}
		});
	};

	if (isInstalled) return null;

	return (
		<motion.button
			onClick={handleInstall}
			disabled={!installPrompt}
			initial={{ opacity: 0, y: 40, scale: 0.9 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			className={`fixed bottom-5 right-5 sm:bottom-6 sm:right-6 px-5 py-3 rounded-full backdrop-blur-md border shadow-lg flex items-center gap-2 font-semibold text-sm sm:text-base active:scale-95 transition-all duration-300
        ${isDark
					? "bg-white/10 border-white/20 text-white hover:bg-white/20"
					: "bg-black/10 border-black/20 text-black hover:bg-black/20"
				}
        disabled:opacity-50 disabled:cursor-not-allowed`}
		>
			<Download size={18} />
			<span>Install App</span>
		</motion.button>
	);
}
