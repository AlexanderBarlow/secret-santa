"use client";
import { useState, useEffect, useRef, memo } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import LanguageSwitcher from "../components/languageswitcher";

// === Memoized Wishlist Form ===
const WishlistForm = memo(function WishlistForm({
  wishlistInputs,
  setWishlistInputs,
  onSave,
}) {
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
    <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl text-white">
      <h3 className="text-2xl font-bold mb-6 text-center">
        🎁 {t("Your Wishlist")}
      </h3>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave();
        }}
        className="space-y-4"
      >
        {wishlistInputs.map((item, i) => (
          <input
            key={i}
            type="text"
            value={item}
            onChange={(e) => handleInputChange(i, e.target.value)}
            placeholder={`Item ${i + 1}`}
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white/60 transition-all duration-200"
          />
        ))}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={handleAddWishlistItem}
            className="flex-1 py-2 bg-white/20 hover:bg-white/30 rounded-lg border border-white/30 font-medium transition-all duration-200"
          >
            ➕ {t("Add Item")}
          </button>
          <button
            type="submit"
            className="flex-1 py-2 bg-white/30 hover:bg-white/40 rounded-lg border border-white/40 font-semibold transition-all duration-200"
          >
            💾 {t("Save Wishlist")}
          </button>
        </div>
      </form>
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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tab, setTab] = useState("personal");

  const dataFetched = useRef(false);

  useEffect(() => {
    if (dataFetched.current) return;
    dataFetched.current = true;

    const fetchData = async () => {
      try {
        setLoading(true);
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

        setUser(userRes.data || {});
        setMatchedSanta(userRes.data?.matchedSanta || null);
        setEventDetails(eventRes.data || {});

        const wishlist = wishlistRes.data?.wishlist || [];
        setWishlistInputs(wishlist.length ? wishlist : [""]);
      } catch {
        setError(t("error_fetching_data"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t, router]);

  useEffect(() => {
    if (!matchedSanta) return;

    const fetchSantaWishlist = async () => {
      try {
        const res = await axios.post("/api/assigned", {
          email: matchedSanta.email,
        });
        setMatchedSantaWishlist(res.data?.wishlist?.items || []);
      } catch {
        setMatchedSantaWishlist([]);
      }
    };

    fetchSantaWishlist();
  }, [matchedSanta]);

  const handleAddToWishlist = async () => {
    const validItems = wishlistInputs.filter((item) => item.trim() !== "");
    if (!validItems.length) return setError(t("error_empty_wishlist"));

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/admin/users/addwishlist",
        { wishlist: validItems },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess(t("Wishlist updated successfully"));
      setError("");
    } catch {
      setError(t("Please add items."));
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      localStorage.removeItem("token");
      router.push("/auth/signin");
    } catch {
      setError(t("error_logging_out"));
    }
  };

  const GlassCard = ({ children, className = "" }) => (
    <div
      className={`p-6 sm:p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl text-white transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );

  return (
    <div className="fullscreen-page bg-gradient-to-br from-[#1a1a40] via-[#4054b2] to-[#1b1b2f] text-white">

      {/* === Animated Snow Overlay === */}
      <div className="snowfall">
        <div className="snowflake small" style={{ left: "10%" }}></div>
        <div className="snowflake medium" style={{ left: "35%" }}></div>
        <div className="snowflake large" style={{ left: "60%" }}></div>
        <div className="snowflake small" style={{ left: "80%" }}></div>
        <div className="snowflake medium" style={{ left: "95%" }}></div>
      </div>

      <LanguageSwitcher theme="dark" />

      <section className="w-full max-w-4xl px-4 sm:px-6 md:px-8 flex flex-col items-center justify-start space-y-8 z-10 pb-20">
      <header className="mb-10 text-center z-10 px-4">
        <h1 className="text-4xl sm:text-5xl font-bold drop-shadow-md tracking-wide">
          Secret Santa Dashboard 🎄
        </h1>
        <p className="opacity-80 mt-2 text-sm sm:text-base">
          Celebrate the magic of giving
        </p>
      </header>

      {/* === Tabs === */}
      <div className="flex flex-wrap justify-center bg-white/10 backdrop-blur-md rounded-full border border-white/20 p-2 mb-10 shadow-md z-10 w-full max-w-md gap-2 sm:gap-3">
        <button
          onClick={() => setTab("personal")}
          className={`flex-1 min-w-[130px] py-2 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-200 ${
            tab === "personal"
              ? "bg-white/30 text-white"
              : "text-gray-200 hover:bg-white/10"
          }`}
        >
          🎁 {t("Your Info")}
        </button>
        <button
          onClick={() => setTab("santa")}
          className={`flex-1 min-w-[130px] py-2 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-200 ${
            tab === "santa"
              ? "bg-white/30 text-white"
              : "text-gray-200 hover:bg-white/10"
          }`}
        >
          🎅 {t("Santa Info")}
        </button>
      </div>

      {error && (
        <p className="bg-red-500/30 px-4 py-2 rounded-lg mb-4 text-center w-full max-w-lg z-10">
          {error}
        </p>
      )}
      {success && (
        <p className="bg-green-500/30 px-4 py-2 rounded-lg mb-4 text-center w-full max-w-lg z-10">
          {success}
        </p>
      )}

      {/* === Tab Content === */}
      {loading ? (
        <p className="text-white/70">Loading...</p>
      ) : tab === "personal" ? (
        <div className="w-full max-w-3xl space-y-8 z-10 px-2">
          <GlassCard className="text-center">
            <img
              src={user?.profilePicture || "/default-profile.png"}
              alt="Profile"
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white/30 mx-auto mb-3 object-cover"
            />
            <h2 className="text-xl sm:text-2xl font-semibold break-words">
              {user?.email}
            </h2>
          </GlassCard>

          <WishlistForm
            wishlistInputs={wishlistInputs}
            setWishlistInputs={setWishlistInputs}
            onSave={handleAddToWishlist}
          />
        </div>
      ) : (
        <div className="w-full max-w-3xl space-y-8 z-10 px-2">
          <GlassCard>
            <h3 className="text-2xl font-bold text-center mb-4">
              {t("Matched Santa")} 🎅
            </h3>
            {matchedSanta ? (
              <div className="text-center space-y-3">
                <p className="text-sm sm:text-base">
                  <strong>{t("Name")}:</strong> {matchedSanta.email}
                </p>
                <h4 className="mt-4 font-semibold text-lg">
                  Their Wishlist 🎁
                </h4>
                <ul className="mt-2 space-y-2">
                  {matchedSantaWishlist.length > 0 ? (
                    matchedSantaWishlist.map((item, i) => (
                      <li
                        key={i}
                        className="bg-white/10 px-3 py-2 rounded-md text-sm sm:text-base"
                      >
                        {item.item}
                      </li>
                    ))
                  ) : (
                    <p className="opacity-70">{t("No Wishlist Yet!")}</p>
                  )}
                </ul>
              </div>
            ) : (
              <p className="text-center opacity-70">{t("No Match Yet")}</p>
            )}
          </GlassCard>

          <GlassCard className="text-center">
            <h3 className="text-2xl font-bold mb-3">{t("Event Details")} 🎄</h3>
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
          </GlassCard>
        </div>
        )}
      </section>

      {/* === Logout Button === */}
      <button
        onClick={handleLogout}
        className="fixed bottom-4 right-4 px-5 py-3 bg-white/30 text-white font-semibold rounded-full backdrop-blur-md border border-white/40 shadow-lg hover:bg-white/40 transition z-10"
      >
        Logout
      </button>
    </div>
  );
}
