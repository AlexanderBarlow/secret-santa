"use client";
import { useState, useEffect, useRef, memo } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { motion } from "framer-motion";
import LanguageSwitcher from "../components/languageswitcher";

const FrostedButton = ({ onClick, icon, label, className = "", type = "button" }) => (
  <motion.button
    type={type}
    whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.25)" }}
    whileTap={{ scale: 0.9, backgroundColor: "rgba(255,255,255,0.35)" }}
    onClick={onClick}
    aria-label={label}
    className={`w-11 h-11 flex items-center justify-center rounded-full border border-white/25 backdrop-blur-md bg-white/15 text-white shadow-md hover:shadow-lg transition-all duration-300 ${className}`}
  >
    {icon || "✨"}
  </motion.button>
);


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
        <FrostedButton onClick={handleAddWishlistItem} label="Add Item" icon="➕" />
        <FrostedButton onClick={onSave} label="Save Wishlist" icon="💾" />
      </div>

    </div>
  );
});

export default function UserDashboard() {
  const { t } = useTranslation();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [wishlistInputs, setWishlistInputs] = useState([]);
  const [matchedSanta, setMatchedSanta] = useState(null);
  const [matchedSantaWishlist, setMatchedSantaWishlist] = useState([]);
  const [eventDetails, setEventDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("personal");

  const dataFetched = useRef(false);

  useEffect(() => {
    if (dataFetched.current) return;
    dataFetched.current = true;

    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/auth/signin");

      try {
        const [userRes, wishlistRes, eventRes] = await Promise.all([
          axios.get("/api/userinfo", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/api/admin/users/addwishlist", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/api/admin/users/adduser"),
        ]);

        setUser(userRes.data || {});
        setMatchedSanta(userRes.data?.matchedSanta || null);
        setEventDetails(eventRes.data || {});

        const wishlist = wishlistRes.data?.wishlist || [];
        setWishlistInputs(wishlist.length ? wishlist : [""]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

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

  return (
    <div className="fullscreen-page bg-gradient-to-br from-[#1a1a40] via-[#4054b2] to-[#1b1b2f] text-white overflow-y-auto">
      <LanguageSwitcher theme="dark" />

      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-10 pb-8"
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-2">🎄 Secret Santa</h1>
        <p className="text-white/80">{t("Celebrate the magic of giving")}</p>
      </motion.header>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="flex bg-white/10 backdrop-blur-lg border border-white/20 rounded-full shadow-lg p-2 gap-2">
          {["personal", "santa"].map((id) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-6 py-2 rounded-full font-semibold transition ${tab === id
                  ? "bg-white/30 text-white shadow-md"
                  : "text-gray-200 hover:bg-white/10"
                }`}
            >
              {id === "personal" ? "🎁 " + t("Your Info") : "🎅 " + t("Santa Info")}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <motion.section layout className="w-full max-w-3xl mx-auto px-5 pb-24">
        {loading ? (
          <p className="text-center text-white/70">{t("Loading...")}</p>
        ) : tab === "personal" ? (
          <motion.div
            layout
            className="relative rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-6 sm:p-10 text-center"
          >
            {/* Profile header */}
            <motion.img
              src={user?.profilePicture || "/default-profile.png"}
              alt="Profile"
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white/30 mx-auto mb-4 object-cover shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 150 }}
            />

            <h2 className="text-2xl font-semibold mb-2">{user?.email}</h2>

            {/* Event Info */}
            <div className="mt-3 text-sm text-white/80">
              <p>
                <strong>{t("Event Date")}:</strong>{" "}
                {eventDetails.eventDate
                  ? new Date(eventDetails.eventDate).toLocaleDateString()
                  : "-"}
              </p>
              <p>
                <strong>{t("Match Date")}:</strong>{" "}
                {eventDetails.matchSantaDate
                  ? new Date(eventDetails.matchSantaDate).toLocaleDateString()
                  : "-"}
              </p>
              <p>
                <strong>{t("Overview")}:</strong> {eventDetails.overview || "-"}
              </p>
            </div>

            {/* Wishlist */}
            <WishlistForm
              wishlistInputs={wishlistInputs}
              setWishlistInputs={setWishlistInputs}
              onSave={handleAddToWishlist}
            />
          </motion.div>
        ) : (
          <motion.div
            layout
            className="relative rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-6 sm:p-10 text-center"
          >
            {matchedSanta ? (
              <>
                <img
                  src={matchedSanta?.profilePicture || "/santa.png"}
                  alt="Santa"
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white/30 mx-auto mb-3 object-cover"
                />
                <h3 className="text-xl font-semibold">{matchedSanta.email}</h3>

                <h4 className="mt-5 text-lg font-semibold">
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
      </motion.section>

      {/* Logout */}
      <FrostedButton
        onClick={handleLogout}
        label="Logout"
        icon="🚪"
        className="fixed bottom-6 right-6"
      />
    </div>
  );
}
