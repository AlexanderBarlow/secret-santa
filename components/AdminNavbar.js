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
    { href: "/admin/adduser", icon: faPlus, label: "Event Details" },
    { href: "/admin/matchsanta", icon: faGift, label: "Match Santa" },
    { href: "/admin/analytics", icon: faChartSimple, label: "Analytics" },
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
    <div className="fixed bottom-5 left-0 right-0 z-50 pointer-events-none">
      <nav
        className="pointer-events-auto mx-auto w-[92%] sm:w-[85%] md:w-[70%] lg:w-[60%] 
                   bg-white/40 backdrop-blur-lg border border-white/60 shadow-2xl
                   rounded-full px-6 py-3 relative overflow-hidden"
      >
        {/* Sliding Glow Indicator */}
        <AnimatePresence>
          {navItems.map(
            (item, index) =>
              router.pathname === item.href && (
                <motion.div
                  key={item.href}
                  layoutId="nav-glow"
                  className="absolute top-1/2 -translate-y-1/2 h-10 bg-gradient-to-r from-red-500/30 via-red-400/20 to-transparent rounded-full blur-lg"
                  style={{
                    width: `${100 / navItems.length}%`,
                    left: `${(index / navItems.length) * 100}%`,
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
        <div className="flex justify-between items-center w-full max-w-2xl mx-auto text-gray-800 relative z-10">
          {navItems.map((item) => {
            const isActive = router.pathname === item.href;
            return (
              <Link href={item.href} key={item.href}>
                <div
                  className={`flex flex-col items-center transition-all duration-300 ${
                    isActive
                      ? "text-red-600 drop-shadow-[0_0_8px_rgba(255,0,0,0.7)]"
                      : "text-gray-700 hover:text-red-500"
                  }`}
                >
                  <FontAwesomeIcon icon={item.icon} size="lg" />
                  <span className="text-[0.7rem] font-semibold mt-1">
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}

          {/* Logout Button */}
          <div
            onClick={handleLogout}
            className="flex flex-col items-center cursor-pointer text-gray-700 hover:text-red-600 transition-all duration-300"
          >
            <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
            <span className="text-[0.7rem] font-semibold mt-1">Logout</span>
          </div>
        </div>
      </nav>
    </div>
  );
}
