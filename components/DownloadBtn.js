import { useEffect, useState } from "react";

export default function PWAInstallButton() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

 useEffect(() => {
   const handleBeforeInstallPrompt = (event) => {
     console.log("✅ beforeinstallprompt event fired! PWA is installable.");
     event.preventDefault(); // Prevent automatic prompt
     setInstallPrompt(event);
   };

   window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

   return () => {
     window.removeEventListener(
       "beforeinstallprompt",
       handleBeforeInstallPrompt
     );
   };
 }, []);


const handleInstall = () => {
  if (!installPrompt) {
    console.log("❌ No install prompt available.");
    alert("PWA installation is not available right now.");
    return;
  }

  installPrompt.prompt(); // Show install prompt

  installPrompt.userChoice.then((choice) => {
    console.log("User choice:", choice);
    if (choice.outcome === "accepted") {
      alert(
        "✅ Installation successful! You can now access the app from your home screen."
      );
      setIsInstalled(true);
    } else {
      alert(
        "❌ Installation was canceled. You can install it later from your browser menu."
      );
    }
    setInstallPrompt(null);
  });
};


  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }
  }, []);

  if (isInstalled) return null; // Hide button if PWA is already installed

  return (
    <button
      className="fixed top-4 left-4 z-50 px-4 py-2 text-white bg-blue-600 rounded-lg shadow-lg transition-transform transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300"
      onClick={handleInstall}
      disabled={!installPrompt}
    >
      📲 Install App
    </button>
  );
}
