"use client";

import { useState, useEffect, useRef, memo } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Home, LogOut } from "lucide-react";
import LanguageSwitcher from "../components/languageswitcher";
import EditProfile from "../components/EditProfile";
import UserSanta from "../components/UserSanta";
import UserInfoCard from "../components/UserInfoCard";
import UserNavbar from "../components/UserNavbar";
import SnowfallLayer from "../components/SnowfallLayer";


/* ---------------- Helper: Inappropriate Word Detection ---------------- */
const BAD_WORDS = [
  "fuck",
  "shit",
  "bitch",
  "asshole",
  "dick",
  "pussy",
  "cunt",
  "nigger",
  "kike",
  "chink",
  "spic",
  "faggot",
  "kill myself",
  "suicide",
  "hang myself",
];
const isInappropriate = (text = "") =>
  BAD_WORDS.some((w) => text.toLowerCase().includes(w));

/* ---------------- Frosted Button ---------------- */
const FrostedButton = ({ onClick, icon, label, className = "" }) => (
  <motion.button
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    aria-label={label}
    className={`w-11 h-11 flex items-center justify-center rounded-full border border-white/25 backdrop-blur-md bg-gradient-to-r from-red-500/30 via-green-500/30 to-sky-400/30 text-white shadow-lg transition-all duration-300 ${className}`}
  >
    {icon}
  </motion.button>
);

export default function UserDashboard() {
  const { t } = useTranslation();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [wishlistInputs, setWishlistInputs] = useState([]);
  const [invalidIndices, setInvalidIndices] = useState(new Set());
  const [matchedSanta, setMatchedSanta] = useState(null);
  const [matchedSantaWishlist, setMatchedSantaWishlist] = useState([]);
  const [eventDetails, setEventDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("home");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ kind: "idle", message: "" });
  const [showPendingAlert, setShowPendingAlert] = useState(false);
  const dataFetched = useRef(false);

  /* ------------ Fetch User Data ------------ */
  const fetchUserData = async () => {
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

      const userData = userRes.data || {};
      setUser(userData);
      setMatchedSanta(userData?.matchedSanta || null);
      setEventDetails(eventRes.data || {});
      setMatchedSantaWishlist(userData?.matchedSantaWishlist || []);

      const wishlist = (wishlistRes.data?.wishlist || []).map(String);
      setWishlistInputs(wishlist.length ? wishlist.slice(0, 5) : [""]);

      // 👇 If user is pending, start them on the Profile tab
      if (userData?.Accepted === false || userData?.status === "pending") {
        setTab("profile");
        setShowPendingAlert(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dataFetched.current) return;
    dataFetched.current = true;
    fetchUserData();
  }, [router]);

  /* ------------ Wishlist Validation ------------ */
  const validateWishlist = (items) => {
    const trimmed = items.map((s) => (s ?? "").trim());
    const invalidSet = new Set();
    const filtered = [];

    trimmed.forEach((val, idx) => {
      if (!val) return;
      const tooLong = val.length > 120;
      const bad = isInappropriate(val);
      if (bad || tooLong) invalidSet.add(idx);
      else filtered.push(val);
    });

    return { limited: filtered.slice(0, 5), invalidSet };
  };

  /* ------------ Save Wishlist ------------ */
  const handleAddToWishlist = async () => {
    setSaving(true);
    setSaveStatus({ kind: "idle", message: "" });

    const { limited, invalidSet } = validateWishlist(wishlistInputs);
    setInvalidIndices(invalidSet);

    if (invalidSet.size > 0) {
      setSaving(false);
      setSaveStatus({
        kind: "error",
        message:
          "Some items were flagged or invalid. Please review highlighted fields.",
      });
      return;
    }

    if (!limited.length) {
      setSaving(false);
      setSaveStatus({
        kind: "error",
        message: "Please add at least one valid item before saving.",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/admin/users/addwishlist",
        { wishlist: limited },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        setSaveStatus({
          kind: "success",
          message: "Wishlist saved successfully! 🎁",
        });
        setWishlistInputs(limited);
      } else {
        throw new Error("Non-200 response");
      }
    } catch (err) {
      console.error("Save error:", err);
      setSaveStatus({
        kind: "error",
        message: "There was an error saving your wishlist. Please try again.",
      });
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus({ kind: "idle", message: "" }), 2500);
    }
  };

  /* ------------ Logout ------------ */
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/signin");
  };

  /* ------------ Refresh User ------------ */
  const refreshUser = async () => {
    await fetchUserData();
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden bg-gradient-to-b from-[#0b1437] via-[#1a2e5c] to-[#2e4372]">
      {/* ❄️ Animated Snow Layers */}
      <SnowfallLayer count={35} speed={0.6} size={2} opacity={0.4} zIndex={1} />
      <SnowfallLayer count={20} speed={0.9} size={3} opacity={0.6} zIndex={2} />
      <SnowfallLayer count={15} speed={1.2} size={4} opacity={0.8} zIndex={3} />

      <LanguageSwitcher theme="dark" />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-8 pb-6"
      >
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-red-400 via-emerald-300 to-sky-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
          🎄 Secret Santa
        </h1>
        <p className="text-white/80 text-sm mt-1">
          {t("Celebrate the magic of giving")}
        </p>
      </motion.header>

      {/* ---------- Main Content ---------- */}
      <div className="relative z-10 flex flex-col items-center pb-28">
        {loading ? (
          <p className="text-center text-white/70">{t("Loading...")}</p>
        ) : (
          <AnimatePresence mode="wait">
            {tab === "home" && (
              <UserInfoCard
                user={user}
                eventDetails={eventDetails}
                wishlistInputs={wishlistInputs}
                setWishlistInputs={setWishlistInputs}
                invalidIndices={invalidIndices}
                saving={saving}
                saveStatus={saveStatus}
                onSave={handleAddToWishlist}
                t={t}
              />
            )}

            {tab === "profile" && (
              <EditProfile user={user} refreshUser={refreshUser} />
            )}

            {tab === "santa" && (
              <UserSanta
                matchedSanta={matchedSanta}
                matchedSantaWishlist={matchedSanta?.wishlist?.items || []}
                userId={user.id}
                t={t}
              />
            )}
          </AnimatePresence>
        )}
      </div>

      {/* ---------- Navbar ---------- */}
      <UserNavbar tab={tab} setTab={setTab} user={user} />

      {/* ---------- Logout ---------- */}
      <FrostedButton
        onClick={handleLogout}
        label="Logout"
        icon={<LogOut className="w-5 h-5" />}
        className="fixed right-6 bottom-[110px] sm:bottom-6 z-[60] cursor-pointer"
      />
    </div>
  );
}
