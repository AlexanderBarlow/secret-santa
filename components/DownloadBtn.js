import { useEffect, useState } from "react";

export default function PWAInstallButton() {
	const [installPrompt, setInstallPrompt] = useState(null);
	const [isInstalled, setIsInstalled] = useState(false);

	useEffect(() => {
		const handleBeforeInstallPrompt = (event) => {
			event.preventDefault(); // Prevent automatic prompt≈çç≈≈
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

	useEffect(() => {
		if (window.matchMedia("(display-mode: standalone)").matches) {
			setIsInstalled(true);
		}
	}, []);

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

	if (isInstalled) return null; // Hide if already installed

	return (
		<button
			onClick={handleInstall}
			disabled={!installPrompt}
			className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all duration-300 hover:bg-blue-700 hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
		>
			📲 Install App
		</button>
	);
}
