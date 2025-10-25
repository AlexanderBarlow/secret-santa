"use client";

import { useState, useEffect, useRef, memo } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Home, User, Gift, Upload, LogOut } from "lucide-react";
import LanguageSwitcher from "../components/languageswitcher";

/* ---------------- Frosted Button ---------------- */
const FrostedButton = ({
  onClick,
  icon,
  label,
  className = "",
  type = "button",
}) => (
  <motion.button
    type={type}
    whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.25)" }}
    whileTap={{ scale: 0.9, backgroundColor: "rgba(255,255,255,0.35)" }}
    onClick={onClick}
    aria-label={label}
    className={`w-11 h-11 flex items-center justify-center rounded-full border border-white/25 backdrop-blur-md bg-white/15 text-white shadow-md hover:shadow-lg transition-all duration-300 ${className}`}
  >
    {icon}
  </motion.button>
);

/* ---------------- Wishlist Form ---------------- */
const WishlistForm = memo(({ wishlistInputs, setWishlistInputs, onSave }) => {
  const { t } = useTranslation();

  const handleInputChange = (index, value) => {
    setWishlistInputs((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleAddWishlistItem = () => {
    setWishlistInputs((prev) => [...prev, ""]);
  };

  return (
    <div className="space-y-4 mt-5">
      {wishlistInputs.map((item, i) => (
        <motion.input
          key={i}
          type="text"
          value={item}
          onChange={(e) => handleInputChange(i, e.target.value)}
          placeholder={`🎁 ${t("Wishlist Item")} ${i + 1}`}
          className="w-full px-4 py-3 bg-white/15 border border-white/25 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/60 transition-all duration-200"
          whileFocus={{ scale: 1.02 }}
        />
      ))}

      <div className="flex justify-center gap-3 pt-4">
        <FrostedButton
          onClick={handleAddWishlistItem}
          label="Add Item"
          icon={<span>➕</span>}
        />
        <FrostedButton
          onClick={onSave}
          label="Save Wishlist"
          icon={<span>💾</span>}
        />
      </div>
    </div>
  );
});

/* ---------------- Dashboard ---------------- */
export default function UserDashboard() {
  const { t } = useTranslation();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [wishlistInputs, setWishlistInputs] = useState([]);
  const [matchedSanta, setMatchedSanta] = useState(null);
  const [matchedSantaWishlist, setMatchedSantaWishlist] = useState([]);
  const [eventDetails, setEventDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("home");
  const dataFetched = useRef(false);

  /* ---------------- Fetch Data ---------------- */
  useEffect(() => {
    if (dataFetched.current) return;
    dataFetched.current = true;

    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/auth/signin");

      try {
        const [userRes, wishlistRes, eventRes] = await Promise.all([
          axios.get("/api/userinfo", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/admin/users/addwishlist", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/admin/users/adduser"),
        ]);

        setUser(userRes.data || {});
        setMatchedSanta(userRes.data?.matchedSanta || null);
        setEventDetails(eventRes.data || {});

        const wishlist = wishlistRes.data?.wishlist || [];
        setWishlistInputs(wishlist.length ? wishlist : [""]);
        setMatchedSantaWishlist(userRes.data?.matchedSantaWishlist || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  /* ---------------- Wishlist Save ---------------- */
  const handleAddToWishlist = async () => {
    const validItems = wishlistInputs.filter((item) => item.trim() !== "");
    if (!validItems.length) return;

    const token = localStorage.getItem("token");
    await axios.post(
      "/api/admin/users/addwishlist",
      { wishlist: validItems },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/signin");
  };

  /* ---------------- Snowflake Data ---------------- */
  const flakes = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: ((i * 37) % 100) + "%",
    size: 6 + ((i * 11) % 10),
    duration: 10 + ((i * 7) % 10),
    delay: (i * 0.7) % 6,
    opacity: 0.6 + (((i * 13) % 4) / 10),
    drift: (i % 2 ? 30 : -30),
  }));

  /* ---------------- Render ---------------- */
  return (
    <div className="relative min-h-screen text-white overflow-hidden bg-gradient-to-b from-[#0b1437] via-[#122359] to-[#1b3f9d]">
      {/* Snow */}
      <div className="absolute inset-0 pointer-events-none">
        {flakes.map((f) => (
          <span
            key={f.id}
            className="snowflake"
            style={{
              left: f.left,
              width: f.size,
              height: f.size,
              animationDuration: `${f.duration}s`,
              animationDelay: `${f.delay}s`,
              opacity: f.opacity,
              ["--drift"]: `${f.drift}px`,
            }}
          />
        ))}
      </div>

      <LanguageSwitcher theme="dark" />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-8 pb-6"
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-1">🎄 Secret Santa</h1>
        <p className="text-white/80 text-sm">
          {t("Celebrate the magic of giving")}
        </p>
      </motion.header>

      {/* Tabs Content */}
      <div className="relative z-10 flex flex-col items-center pb-28">
        <AnimatePresence mode="wait">
          {loading ? (
            <p className="text-center text-white/70">{t("Loading...")}</p>
          ) : (
            <>
              {/* ---------------- Home ---------------- */}
              {tab === "home" && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="w-11/12 max-w-md rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-6 sm:p-10 text-center"
                >
                  <motion.img
                    src={user?.profilePicture || "/default-profile.png"}
                    alt="Profile"
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white/30 mx-auto mb-4 object-cover shadow-lg"
                    whileHover={{ scale: 1.05 }}
                  />
                  <h2 className="text-xl font-semibold mb-2">{user?.email}</h2>

                  <div className="text-sm text-white/80 space-y-1">
                    <p>
                      <strong>{t("Event Date")}:</strong>{" "}
                      {eventDetails.eventDate
                        ? new Date(eventDetails.eventDate).toLocaleDateString()
                        : "-"}
                    </p>
                    <p>
                      <strong>{t("Match Date")}:</strong>{" "}
                      {eventDetails.matchSantaDate
                        ? new Date(
                          eventDetails.matchSantaDate
                        ).toLocaleDateString()
                        : "-"}
                    </p>
                    <p>
                      <strong>{t("Overview")}:</strong>{" "}
                      {eventDetails.overview || "-"}
                    </p>
                  </div>

                  <WishlistForm
                    wishlistInputs={wishlistInputs}
                    setWishlistInputs={setWishlistInputs}
                    onSave={handleAddToWishlist}
                  />
                </motion.div>
              )}

              {/* ---------------- Profile ---------------- */}
              {tab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="w-11/12 max-w-md rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-6 sm:p-10 text-center"
                >
                  <h2 className="text-xl font-semibold mb-4">👤 Edit Profile</h2>
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <img
                        src={user?.profilePicture || "/default-profile.png"}
                        alt="Profile"
                        className="w-24 h-24 rounded-full border-2 border-white/30"
                      />
                      <button className="absolute bottom-0 right-0 bg-white text-[#0b1437] p-2 rounded-full shadow">
                        <Upload className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Full Name"
                      defaultValue={user?.name || ""}
                      className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-sm placeholder:text-white/50"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      defaultValue={user?.email || ""}
                      className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-sm placeholder:text-white/50"
                    />
                    <button className="mt-2 px-4 py-2 bg-white text-[#0b1437] rounded-xl text-sm font-medium hover:bg-white/80 transition">
                      Save Changes
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ---------------- Santa ---------------- */}
              {tab === "santa" && (
                <motion.div
                  key="santa"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="w-11/12 max-w-md rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-6 sm:p-10 text-center"
                >
                  {matchedSanta ? (
                    <>
                      <img
                        src={matchedSanta?.profilePicture || "/santa.png"}
                        alt="Santa"
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white/30 mx-auto mb-3 object-cover"
                      />
                      <h3 className="text-lg font-semibold mb-1">
                        {matchedSanta.email}
                      </h3>

                      <h4 className="mt-4 text-md font-semibold">
                        🎁 {t("Their Wishlist")}
                      </h4>
                      <div className="flex flex-wrap justify-center gap-2 mt-3">
                        {matchedSantaWishlist.length > 0 ? (
                          matchedSantaWishlist.map((item, i) => (
                            <span
                              key={i}
                              className="bg-white/20 px-3 py-1.5 rounded-full text-sm"
                            >
                              {item.item}
                            </span>
                          ))
                        ) : (
                          <p className="opacity-70">{t("No Wishlist Yet!")}</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="opacity-70">{t("No Match Yet")}</p>
                  )}
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>

  
      {/* ---------------- Floating Navbar ---------------- */}
      <motion.nav
        className="fixed bottom-6 inset-x-0 flex items-center justify-center z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 15 }}
      >
        <div
          className="relative flex items-center justify-between w-[88%] max-w-sm h-[70px] px-10 mx-auto rounded-full backdrop-blur-2xl bg-white/15 border border-white/25 shadow-[0_8px_35px_rgba(0,0,0,0.35)]"
        >
          {/* Profile Tab */}
          <button
            onClick={() => setTab('profile')}
            className={`flex flex-col items-center justify-center text-sm ${tab === 'profile' ? 'text-white' : 'text-white/70'
              }`}
          >
            <User className="w-6 h-6 mb-0.5" />
            <span className="text-[11px] leading-none">Profile</span>
          </button>

          {/* Santa Tab */}
          <button
            onClick={() => setTab('santa')}
            className={`flex flex-col items-center justify-center text-sm ${tab === 'santa' ? 'text-white' : 'text-white/70'
              }`}
          >
            <Gift className="w-6 h-6 mb-0.5" />
            <span className="text-[11px] leading-none">Santa</span>
          </button>

          {/* Floating Home Button */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%]">
            <button
              onClick={() => setTab('home')}
              className={`flex flex-col items-center justify-center w-[80px] h-[80px] rounded-full ${tab === 'home' ? 'bg-white text-[#0b1437]' : 'bg-white/30 text-white'
                } shadow-[0_10px_30px_rgba(0,0,0,0.35)] border border-white/40 transition-all duration-300`}
            >
              <Home className="w-7 h-7 mb-0.5" />
              <span className="text-[11px] font-medium leading-none">Home</span>
            </button>
          </div>
        </div>
      </motion.nav>




      {/* Logout Button */}
      <FrostedButton
        onClick={handleLogout}
        label="Logout"
        icon={<LogOut className="w-5 h-5" />}
        className="fixed right-6 bottom-[110px] sm:bottom-6 z-[60] cursor-pointer"
      />

      {/* Snow Animation */}
      <style jsx>{`
        .snowflake {
          position: absolute;
          top: -24px;
          border-radius: 9999px;
          background: radial-gradient(white, rgba(255, 255, 255, 0.6));
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.6);
          animation-name: fall, sway;
          animation-timing-function: linear, ease-in-out;
          animation-iteration-count: infinite, infinite;
        }
        @keyframes fall {
          0% {
            transform: translate3d(0, -5vh, 0);
          }
          100% {
            transform: translate3d(0, 105vh, 0);
          }
        }
        @keyframes sway {
          0% {
            margin-left: 0;
          }
          50% {
            margin-left: var(--drift, 30px);
          }
          100% {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
}
