"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";
import { Loader2, RefreshCcw, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MatchSantaPage() {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [localMatches, setLocalMatches] = useState({});
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);

  // === Fetch all users (and their matches) on load ===
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("/api/admin/users");
        setUsers(data);
        initializeLocalMatches(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // === Initialize match state from DB ===
  const initializeLocalMatches = (userList) => {
    const matches = {};
    userList.forEach((user) => {
      if (user.matchedSantaId) {
        matches[user.id] = user.matchedSantaId;
      }
    });
    setLocalMatches(matches);
  };

  // === Handle selection change ===
  const handleChange = (giverId, receiverId) => {
    if (giverId === receiverId) return;
    setLocalMatches((prev) => ({
      ...prev,
      [giverId]: receiverId ? Number(receiverId) : null,
    }));
  };

  // === Handle remove match ===
  const handleRemoveMatch = (giverId) => {
    setLocalMatches((prev) => ({
      ...prev,
      [giverId]: null,
    }));
  };

  // === Save matches ===
  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    const matchesArray = Object.entries(localMatches)
      .filter(([_, receiverId]) => receiverId)
      .map(([giverId, receiverId]) => ({
        giverId: Number(giverId),
        receiverId: Number(receiverId),
      }));

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/admin/users/selectmatch",
        { matches: matchesArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ Matches saved successfully!");
    } catch (error) {
      console.error("Error saving matches:", error);
      setMessage("❌ Error saving matches.");
    } finally {
      setSaving(false);
    }
  };

  // === Generate Matches ===
  const handleGenerateMatches = async () => {
    setSaving(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/admin/users/generatematches",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 200) {
        setMessage("✅ Matches generated successfully!");
        const { data } = await axios.get("/api/admin/users");
        setUsers(data);
        initializeLocalMatches(data);
      }
    } catch (error) {
      console.error("Error generating matches:", error);
      setMessage("❌ Failed to generate matches.");
    } finally {
      setSaving(false);
    }
  };

  // === Reset All Matches ===
  const handleResetAllMatches = async () => {
    setResetting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/admin/users/resetmatches",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLocalMatches({});
      setMessage("🎁 All matches have been cleared!");
      const { data } = await axios.get("/api/admin/users");
      setUsers(data);
    } catch (error) {
      console.error("Error resetting matches:", error);
      setMessage("❌ Failed to reset matches.");
    } finally {
      setResetting(false);
      setShowResetConfirm(false);
    }
  };

  const groupByRole = (role) => users.filter((u) => u.role === role);
  const hasMatches = users.some((u) => u.matchedSantaId);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a1a40] via-[#4054b2] to-[#1b1b2f] text-white pb-28">
      {/* === Header === */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-lg">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-wide drop-shadow-sm">
            🎅 Match Santa
          </h1>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {!hasMatches && (
              <button
                onClick={handleGenerateMatches}
                disabled={saving}
                className="px-5 py-2 rounded-full bg-green-500/40 border border-green-400/50 backdrop-blur-md 
                  text-white font-semibold shadow-md hover:bg-green-500/60 transition"
              >
                🎁 Generate Matches
              </button>
            )}
            <button
              onClick={() => setShowResetConfirm(true)}
              disabled={resetting}
              className="px-4 py-2 rounded-full bg-red-500/40 border border-red-400/50 
                text-white font-semibold shadow-md hover:bg-red-500/60 transition"
            >
              <RefreshCcw className="inline w-4 h-4 mr-1" />
              {resetting ? "Resetting..." : "Reset All"}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 rounded-full bg-white/20 border border-white/40 backdrop-blur-md 
                text-white font-semibold shadow-md hover:bg-white/30 transition"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin inline w-4 h-4 mr-1" />
                  Saving...
                </>
              ) : (
                "💾 Save"
              )}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {message && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`text-center text-sm sm:text-base py-2 font-medium ${
                message.startsWith("✅") || message.startsWith("🎁")
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>
      </header>

      {/* === Main Body === */}
      <main className="flex-grow p-4 sm:p-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <RoleSection
            title="Front of House 🎁"
            users={groupByRole("FRONT_OF_HOUSE")}
            allUsers={users}
            localMatches={localMatches}
            handleChange={handleChange}
            handleRemoveMatch={handleRemoveMatch}
          />
          <RoleSection
            title="Back of House 🍳"
            users={groupByRole("BACK_OF_HOUSE")}
            allUsers={users}
            localMatches={localMatches}
            handleChange={handleChange}
            handleRemoveMatch={handleRemoveMatch}
          />
        </div>
      </main>

      <AdminNavbar />
    </div>
  );
}

/* === Role Section === */
function RoleSection({
  title,
  users,
  allUsers,
  localMatches,
  handleChange,
  handleRemoveMatch,
}) {
  const matchedReceiverIds = new Set(
    Object.values(localMatches).filter(Boolean)
  );

  const getRoleColor = (role) => {
    if (role === "FRONT_OF_HOUSE") return "green";
    if (role === "BACK_OF_HOUSE") return "purple";
    return "blue";
  };

  const getGradient = (role) => {
    if (role === "FRONT_OF_HOUSE")
      return "from-green-500/80 via-green-400/60 to-green-300/30";
    if (role === "BACK_OF_HOUSE")
      return "from-purple-500/80 via-purple-400/60 to-purple-300/30";
    return "from-blue-500/80 via-blue-400/60 to-blue-300/30";
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="space-y-6"
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-center drop-shadow-md">
        {title}
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user, idx) => {
          const selectedReceiverId = localMatches[user.id];
          const selectedReceiver =
            allUsers.find((u) => u.id === selectedReceiverId) || null;

          const availableReceivers = allUsers.filter(
            (u) => u.id !== user.id && !matchedReceiverIds.has(u.id)
          );

          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 p-5 rounded-2xl 
                         shadow-lg flex flex-col items-center text-center 
                         transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
            >
              <img
                src={user.profilePicture || "/default-profile.png"}
                alt={user.email}
                className="w-24 h-24 rounded-full border-2 border-white/30 mb-3 object-cover"
              />
              <h3 className="font-semibold text-lg truncate max-w-[220px]">
                {user.email}
              </h3>
              <p className="text-xs text-white/70 mb-2">
                Role:{" "}
                <span
                  className={`text-${getRoleColor(
                    user.role
                  )}-400 font-semibold`}
                >
                  {user.role.replaceAll("_", " ")}
                </span>
              </p>

              {selectedReceiver ? (
                <div className="mt-4 w-full">
                  <p className="text-sm opacity-80 mb-2">🎁 Matched with:</p>
                  <div className="flex flex-col items-center">
                    <img
                      src={
                        selectedReceiver.profilePicture ||
                        "/default-profile.png"
                      }
                      alt={selectedReceiver.email}
                      className="w-16 h-16 rounded-full border border-white/40 mb-2 object-cover"
                    />
                    <p className="text-sm">{selectedReceiver.email}</p>
                    <p
                      className={`text-xs text-${getRoleColor(
                        selectedReceiver.role
                      )}-400`}
                    >
                      {selectedReceiver.role.replaceAll("_", " ")}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveMatch(user.id)}
                    className="mt-3 px-3 py-1.5 rounded-full bg-red-500/40 
                               hover:bg-red-600/60 text-white text-xs font-semibold transition"
                  >
                    ❌ Remove
                  </button>
                </div>
              ) : (
                <div className="mt-4 w-full relative">
                  <p className="text-sm opacity-80 mb-2">Select receiver:</p>
                  <div className="relative">
                    <select
                      className="w-full p-2 rounded-lg bg-gradient-to-r from-white/10 via-white/20 to-white/10 
                        border border-white/30 text-white text-sm pr-8 cursor-pointer
                        focus:ring-2 focus:ring-white/50 outline-none transition-all duration-200 appearance-none"
                      value={selectedReceiverId || ""}
                      onChange={(e) =>
                        handleChange(user.id, e.target.value || null)
                      }
                    >
                      <option value="">— Select —</option>
                      {availableReceivers.map((receiver) => (
                        <option
                          key={receiver.id}
                          value={receiver.id}
                          className={`${
                            receiver.role === "FRONT_OF_HOUSE"
                              ? "bg-green-200 text-black"
                              : receiver.role === "BACK_OF_HOUSE"
                              ? "bg-purple-200 text-black"
                              : "bg-blue-200 text-black"
                          }`}
                        >
                          {receiver.email} —{" "}
                          {receiver.role.replaceAll("_", " ")}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 text-white/60 pointer-events-none" />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
