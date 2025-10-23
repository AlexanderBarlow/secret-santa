import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faPlus,
  faGift,
  faSignOutAlt,
  faChartSimple,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminNavbar() {
  const router = useRouter();

  const navItems = [
    { href: "/admin/dashboard", icon: faUsers, label: "Users" },
    { href: "/admin/adduser", icon: faPlus, label: "Event" },
    { href: "/admin/matchsanta", icon: faGift, label: "Match" },
    { href: "/admin/analytics", icon: faChartSimple, label: "Stats" },
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
      <nav
        className="pointer-events-auto mx-auto w-[90%] sm:w-[60%] md:w-[50%] lg:w-[40%]
                   bg-white/30 backdrop-blur-lg border border-white/40 shadow-xl
                   rounded-full px-4 py-2 sm:px-5 sm:py-2.5 flex justify-around items-center"
      >
        {/* Animated Glow */}
        <AnimatePresence>
          {navItems.map(
            (item, index) =>
              router.pathname === item.href && (
                <motion.div
                  key={item.href}
                  layoutId="nav-glow"
                  className="absolute top-1/2 -translate-y-1/2 h-8 bg-gradient-to-r from-red-500/30 via-red-400/20 to-transparent rounded-full blur-md"
                  style={{
                    width: `${100 / (navItems.length + 1)}%`,
                    left: `${(index / (navItems.length + 1)) * 100}%`,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 18,
                  }}
                />
              )
          )}
        </AnimatePresence>

        {/* Nav Items */}
        {navItems.map((item) => {
          const isActive = router.pathname === item.href;
          return (
            <Link
              href={item.href}
              key={item.href}
              className={`flex flex-col items-center justify-center transition-all duration-300 ${isActive
                  ? "text-red-600 drop-shadow-[0_0_8px_rgba(255,0,0,0.7)]"
                  : "text-gray-800 hover:text-red-500"
                }`}
            >
              <FontAwesomeIcon icon={item.icon} className="text-[1rem]" />
              <span className="text-[0.65rem] font-medium mt-[2px] hidden sm:block">
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center text-gray-800 hover:text-red-600 transition-all duration-300"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="text-[1rem]" />
          <span className="text-[0.65rem] font-medium mt-[2px] hidden sm:block">
            Logout
          </span>
        </button>
      </nav>
    </div>
  );
}
