"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import LanguageSwitcher from "../components/languageswitcher";

export default function UserDashboard() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [wishlistInputs, setWishlistInputs] = useState([]);
  const [matchedSanta, setMatchedSanta] = useState(null);
  const [matchedSantaWishlist, setMatchedSantaWishlist] = useState([]);
  const [eventDetails, setEventDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tab, setTab] = useState("user");

  // Fetch user, wishlist, and event data once
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const [userRes, wishlistRes, eventRes] = await Promise.all([
          axios.get("/api/userinfo", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/admin/users/addwishlist", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/admin/users/adduser"),
        ]);

        setUser(userRes.data);
        setMatchedSanta(userRes.data.matchedSanta || null);
        setEventDetails(eventRes.data || {});

        // Initialize wishlistInputs only once
        setWishlistInputs(
          wishlistRes.data?.wishlist?.length ? wishlistRes.data.wishlist : [""]
        );
      } catch {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  const handleInputChange = (index, value) => {
    const updated = [...wishlistInputs];
    updated[index] = value;
    setWishlistInputs(updated);
  };

  const addWishlistItem = () => {
    setWishlistInputs([...wishlistInputs, ""]);
  };

  const removeWishlistItem = (index) => {
    setWishlistInputs(wishlistInputs.filter((_, i) => i !== index));
  };

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    const validWishlist = wishlistInputs.map((w) => w.trim()).filter(Boolean);
    if (!validWishlist.length) return setError("Wishlist cannot be empty");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/admin/users/addwishlist",
        { wishlist: validWishlist },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("Wishlist updated successfully");
      setError("");
    } catch {
      setError("Failed to save wishlist");
    }
  };

  const handleLogout = async () => {
    await axios.post("/api/auth/logout");
    localStorage.removeItem("token");
    router.push("/auth/signin");
  };

  const GlassCard = ({ children, className = "" }) => (
    <div
      className={`w-full p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/30 shadow-xl text-white ${className}`}
    >
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-700 via-pink-600 to-red-800 flex flex-col items-center text-white px-4 py-10">
      <LanguageSwitcher />
      <header className="mb-6 text-center">
        <h1 className="text-4xl font-bold drop-shadow-lg">
          Secret Santa Dashboard
        </h1>
        <p className="opacity-80">Spread joy and cheer this season!</p>
      </header>

      <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full p-1 mb-6 border border-white/20">
        {["user", "santa"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 px-6 py-2 rounded-full text-sm font-medium transition ${
              tab === t
                ? "bg-white/30 text-white"
                : "text-gray-200 hover:bg-white/10"
            }`}
          >
            {t === "user" ? "🎁 Your Info" : "🎅 Santa Info"}
          </button>
        ))}
      </div>

      {error && (
        <p className="bg-red-500/30 px-4 py-2 rounded-lg mb-3">{error}</p>
      )}
      {success && (
        <p className="bg-green-500/30 px-4 py-2 rounded-lg mb-3">{success}</p>
      )}

      {loading ? (
        <p className="text-white/70">Loading...</p>
      ) : tab === "user" ? (
        <GlassCard>
          <div className="text-center mb-4">
            <img
              src={user?.profilePicture || "/default-profile.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white/40 mx-auto mb-4 object-cover"
            />
            <h2 className="text-2xl font-semibold">{user?.email}</h2>
          </div>

          <form onSubmit={handleAddToWishlist} className="space-y-3">
            {wishlistInputs.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder={`Item ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeWishlistItem(index)}
                  className="px-3 py-2 bg-red-500/40 hover:bg-red-500/60 rounded-lg"
                >
                  ✖
                </button>
              </div>
            ))}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={addWishlistItem}
                className="flex-1 bg-white/20 py-2 rounded-lg border border-white/30 hover:bg-white/30"
              >
                ➕ Add Item
              </button>
              <button
                type="submit"
                className="flex-1 bg-white/30 py-2 rounded-lg border border-white/40 hover:bg-white/40 font-semibold"
              >
                💾 Save Wishlist
              </button>
            </div>
          </form>
        </GlassCard>
      ) : (
        <GlassCard>
          <h3 className="text-2xl font-semibold mb-3 text-center">
            Your Secret Santa
          </h3>
          {matchedSanta ? (
            <div className="text-center space-y-2">
              <p>
                Name: <strong>{matchedSanta.email}</strong>
              </p>
              <h4 className="mt-3 font-semibold">Their Wishlist 🎁</h4>
              <ul className="mt-2 space-y-1">
                {matchedSantaWishlist.length ? (
                  matchedSantaWishlist.map((item, i) => (
                    <li key={i} className="bg-white/10 px-3 py-1 rounded-md">
                      {item.item}
                    </li>
                  ))
                ) : (
                  <p className="opacity-70">No Wishlist Yet!</p>
                )}
              </ul>
            </div>
          ) : (
            <p className="text-center opacity-80">No Match Yet</p>
          )}
        </GlassCard>
      )}

      <GlassCard className="mt-10 max-w-lg text-center">
        <h4 className="font-semibold text-lg mb-2">Event Details</h4>
        <p>
          Event Date:{" "}
          {eventDetails.eventDate
            ? new Date(eventDetails.eventDate).toLocaleDateString()
            : "-"}
        </p>
        <p>
          Match Date:{" "}
          {eventDetails.matchSantaDate
            ? new Date(eventDetails.matchSantaDate).toLocaleDateString()
            : "-"}
        </p>
        <p>Overview: {eventDetails.overview || "-"}</p>
      </GlassCard>

      <button
        onClick={handleLogout}
        className="fixed bottom-4 right-4 px-5 py-3 bg-white/30 text-white font-semibold rounded-full backdrop-blur-md border border-white/40 shadow-lg hover:bg-white/40 transition"
      >
        Logout
      </button>
    </div>
  );
}
