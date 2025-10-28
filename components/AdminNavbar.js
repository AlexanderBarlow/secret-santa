import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faPlus,
  faGift,
  faSignOutAlt,
  faChartSimple,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminNavbar() {
  const router = useRouter();

  const navItems = [
    { href: "/admin/dashboard", icon: faUsers, label: "Users", color: "#4FC3F7" }, // icy blue
    { href: "/admin/adduser", icon: faPlus, label: "Event", color: "#FFD54F" },   // gold
    { href: "/admin/matchsanta", icon: faGift, label: "Match", color: "#FF6B81" }, // Santa red
    { href: "/admin/analytics", icon: faChartSimple, label: "Stats", color: "#BA68C8" }, // festive purple
    { href: "/admin/questions", icon: faComments, label: "Chats", color: "#81C784" }, // NEW ✅ — chat green
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) {
        localStorage.removeItem("token");
        router.push("/auth/signin");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 pointer-events-none">
      <motion.nav
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
        className="pointer-events-auto mx-auto w-[88%] sm:w-[70%] md:w-[55%] lg:w-[40%] rounded-[2.5rem] px-6 py-3 bg-white/15 backdrop-blur-2xl border border-white/25 shadow-[0_8px_35px_rgba(0,0,0,0.3)] flex justify-around items-center relative overflow-hidden"
      >
        {/* Shimmer reflection */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[2.5rem]">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>

        {/* Active Glow Indicator */}
        <AnimatePresence>
          {navItems.map(
            (item, index) =>
              router.pathname === item.href && (
                <motion.div
                  key={item.href}
                  layoutId="nav-glow"
                  className="absolute top-1/2 -translate-y-1/2 h-[46px] w-[60px] rounded-full blur-lg"
                  style={{
                    left: `calc(${(index + 0.7) * 18}%)`,
                    background: `radial-gradient(circle at center, ${item.color}66, transparent 70%)`,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 140,
                    damping: 20,
                  }}
                />
              )
          )}
        </AnimatePresence>

        {/* Navigation Items */}
        {navItems.map((item) => {
          if (!item.href) return null; // ✅ Prevent undefined href errors

          const isActive = router.pathname === item.href;
          return (
            <motion.div key={item.href} whileHover={{ scale: 1.25 }} whileTap={{ scale: 0.9 }}>
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center transition-all duration-300 ${isActive
                    ? "drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]"
                    : "opacity-90"
                  }`}
              >
                <motion.div
                  animate={
                    isActive
                      ? { scale: [1, 1.15, 1], opacity: [1, 0.8, 1] }
                      : {}
                  }
                  transition={{
                    repeat: isActive ? Infinity : 0,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className="text-[1.25rem] sm:text-[1.1rem]"
                    style={{
                      color: isActive ? item.color : item.color + "CC",
                      filter: isActive
                        ? `drop-shadow(0 0 6px ${item.color})`
                        : "none",
                    }}
                  />
                </motion.div>
                <span className="text-[0.65rem] font-semibold mt-[2px] hidden sm:block text-white/90">
                  {item.label}
                </span>
              </Link>
            </motion.div>
          );
        })}

        {/* Logout Button */}
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className="flex flex-col items-center justify-center text-white/80 hover:text-red-400 transition-all duration-300"
        >
          <FontAwesomeIcon
            icon={faSignOutAlt}
            className="text-[1.25rem]"
            style={{ color: "#FF4D4D" }}
          />
          <span className="text-[0.65rem] font-semibold mt-[2px] hidden sm:block">
            Logout
          </span>
        </motion.button>
      </motion.nav>

      {/* ✨ Animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 7s linear infinite;
        }
      `}</style>
    </div>
  );
}
