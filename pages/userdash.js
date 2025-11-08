"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut } from "lucide-react";
import LanguageSwitcher from "../components/languageswitcher";
import EditProfile from "../components/EditProfile";
import UserSanta from "../components/UserSanta";
import UserInfoCard from "../components/UserInfoCard";
import UserNavbar from "../components/UserNavbar";
import SnowfallLayer from "../components/SnowfallLayer";
import useAuthCheck from "../utils/useAuthCheck";

/* ---------------- Inappropriate Word Detection ---------------- */
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
  const authStatus = useAuthCheck();

  const [user, setUser] = useState(null);
  const [wishlistInputs, setWishlistInputs] = useState([]);
  const [invalidIndices, setInvalidIndices] = useState(new Set());
  const [matchedSanta, setMatchedSanta] = useState(null);
  const [eventDetails, setEventDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("home");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ kind: "idle", message: "" });
  const dataFetched = useRef(false);

  /* 🔁 Redirect after expiration */
  useEffect(() => {
    if (authStatus === "expired") {
      const timer = setTimeout(() => {
        window.location.href = "/auth/signin";
      }, 4000); // ⏳ 4s delay
      return () => clearTimeout(timer);
    }
  }, [authStatus]);

  /* ✅ Fetch only when token valid */
  useEffect(() => {
    if (authStatus !== "valid" || dataFetched.current) return;
    dataFetched.current = true;

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return router.push("/auth/signin");

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

        const wishlist = (wishlistRes.data?.wishlist || []).map(String);
        setWishlistInputs(wishlist.length ? wishlist.slice(0, 5) : [""]);

        if (userData?.Accepted === false || userData?.status === "pending") {
          setTab("profile");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [authStatus, router]);

  /* 🧩 Wishlist Validation */
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

  /* 💾 Save Wishlist */
  const handleAddToWishlist = async () => {
    setSaving(true);
    setSaveStatus({ kind: "idle", message: "" });

    const { limited, invalidSet } = validateWishlist(wishlistInputs);
    setInvalidIndices(invalidSet);

    if (invalidSet.size > 0) {
      setSaveStatus({
        kind: "error",
        message:
          "Some items were flagged or invalid. Please review highlighted fields.",
      });
      setSaving(false);
      return;
    }

    if (!limited.length) {
      setSaveStatus({
        kind: "error",
        message: "Please add at least one valid item before saving.",
      });
      setSaving(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/admin/users/addwishlist",
        { wishlist: limited },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSaveStatus({
        kind: "success",
        message: "Wishlist saved successfully! 🎁",
      });
      setWishlistInputs(limited);
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/signin");
  };

  /* 🧩 Auth Screens */
  if (authStatus === "checking") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#0b1437] text-white text-lg font-bold">
        Checking session...
      </div>
    );
  }

  if (authStatus === "expired") {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-red-900 via-red-700 to-red-600 text-white text-center p-6">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-extrabold drop-shadow-lg mb-3"
        >
          🎁 SESSION EXPIRED 🎁
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg opacity-90"
        >
          Please sign in again.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-sm opacity-70 mt-2"
        >
          Redirecting...
        </motion.p>

        {/* ❄️ Gentle snowfall effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-70 animate-[fall_6s_linear_infinite]"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * -100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${4 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <style jsx>{`
          @keyframes fall {
            0% {
              transform: translateY(0);
              opacity: 1;
            }
            100% {
              transform: translateY(120vh);
              opacity: 0.6;
            }
          }
        `}</style>
      </div>
    );
  }

  /* 🧩 Main Dashboard */
  return (
    <div className="relative min-h-screen text-white overflow-hidden bg-gradient-to-b from-[#0b1437] via-[#1a2e5c] to-[#2e4372]">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute top-5 right-6 z-[50]"
      >
        <LanguageSwitcher theme="dark" />
      </motion.div>

      {/* ❄️ Snow Layers */}
      <SnowfallLayer count={35} speed={0.6} size={2} opacity={0.4} zIndex={1} />
      <SnowfallLayer count={20} speed={0.9} size={3} opacity={0.6} zIndex={2} />
      <SnowfallLayer count={15} speed={1.2} size={4} opacity={0.8} zIndex={3} />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-16 pb-6"
      >
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-red-400 via-emerald-300 to-sky-400 bg-clip-text text-transparent">
          🎄 Secret Santa
        </h1>
        <p className="text-white/80 text-sm mt-1">
          {t("Celebrate the magic of giving")}
        </p>
      </motion.header>

      {/* Main Content */}
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
              <EditProfile
                user={user}
                refreshUser={() => (dataFetched.current = false)}
              />
            )}
            {tab === "santa" && (
              <UserSanta
                matchedSanta={matchedSanta}
                matchedSantaWishlist={matchedSanta?.wishlist?.items || []}
                userId={user?.id}
                eventDetails={eventDetails}
                t={t}
              />
            )}
          </AnimatePresence>
        )}
      </div>

      <UserNavbar tab={tab} setTab={setTab} user={user} />
      <FrostedButton
        onClick={handleLogout}
        label="Logout"
        icon={<LogOut className="w-5 h-5" />}
        className="fixed right-6 bottom-[110px] sm:bottom-6 z-[60] cursor-pointer"
      />
    </div>
  );
}
