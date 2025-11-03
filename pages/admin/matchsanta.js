"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";
import { Loader2, RefreshCcw, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MatchSantaPage() {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [localMatches, setLocalMatches] = useState({});
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);

  // === Fetch all users on mount ===
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("/api/admin/users");
        setUsers(data);
        const matches = {};
        data.forEach((u) => {
          if (u.matchedSantaId) matches[u.id] = u.matchedSantaId;
        });
        setLocalMatches(matches);
      } catch (e) {
        console.error(e);
      }
    };
    fetchUsers();
  }, []);

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
        const next = {};
        data.forEach((u) => {
          if (u.matchedSantaId) next[u.id] = u.matchedSantaId;
        });
        setLocalMatches(next);
      } else {
        setMessage("❌ Failed to generate matches.");
      }
    } catch (e) {
      console.error("Error generating matches:", e);
      setMessage("❌ Failed to generate matches.");
    } finally {
      setSaving(false);
    }
  };

  // === Save Matches ===
  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const payload = Object.entries(localMatches)
        .filter(([_, rid]) => rid)
        .map(([gid, rid]) => ({ giverId: +gid, receiverId: +rid }));

      await axios.post(
        "/api/admin/users/selectmatch",
        { matches: payload },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("✅ Matches saved successfully!");
    } catch {
      setMessage("❌ Error saving matches.");
    } finally {
      setSaving(false);
    }
  };

  // === Reset All Matches ===
  const handleResetAllMatches = async () => {
    const hasAny = Object.values(localMatches).some((v) => v);
    if (!hasAny) {
      setMessage("⚠️ No matches to reset.");
      setShowResetConfirm(false);
      return;
    }

    setResetting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/admin/users/resetmatches",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLocalMatches({});
      const { data } = await axios.get("/api/admin/users");
      setUsers(data);
      setMessage("🎁 All matches cleared!");
    } catch {
      setMessage("❌ Failed to reset matches.");
    } finally {
      setResetting(false);
      setShowResetConfirm(false);
    }
  };

  const handleChange = (giverId, receiverId) => {
    if (giverId === receiverId) return;
    setLocalMatches((prev) => ({ ...prev, [giverId]: Number(receiverId) || null }));
  };

  const handleRemoveMatch = (giverId) =>
    setLocalMatches((prev) => ({ ...prev, [giverId]: null }));

  const hasMatches = users.some((u) => u.matchedSantaId);
  const groupByRole = (role) => users.filter((u) => u.role === role);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a1a40] via-[#4054b2] to-[#1b1b2f] text-white pb-28">
      {/* header */}
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
                className="px-5 py-2 rounded-full bg-green-500/40 border border-green-400/50 text-white font-semibold shadow-md hover:bg-green-500/60 transition"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin inline w-4 h-4 mr-1" />
                    Generating...
                  </>
                ) : (
                  "🎁 Generate Matches"
                )}
              </button>
            )}

            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 rounded-full bg-red-500/40 border border-red-400/50 text-white font-semibold shadow-md hover:bg-red-500/60 transition flex items-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" /> Reset All
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 rounded-full bg-white/20 border border-white/40 backdrop-blur-md text-white font-semibold shadow-md hover:bg-white/30 transition"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin inline w-4 h-4 mr-1" /> Saving...
                </>
              ) : (
                "💾 Save"
              )}
            </button>
          </div>
        </div>
        {message && (
          <p
            className={`text-center text-sm py-2 ${message.startsWith("✅") || message.startsWith("🎁")
                ? "text-green-400"
                : "text-red-400"
              }`}
          >
            {message}
          </p>
        )}
      </header>

      {/* reset modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-2xl max-w-sm text-white"
            >
              <button
                onClick={() => setShowResetConfirm(false)}
                className="absolute right-3 top-3 p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5 text-white/80" />
              </button>
              <h2 className="text-lg font-semibold mb-3 text-red-300">
                ⚠️ Confirm Reset
              </h2>
              <p className="text-white/80 mb-6">
                This will remove <strong>all matches</strong>. Continue?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={handleResetAllMatches}
                  className="px-6 py-2 bg-red-500/70 hover:bg-red-600/90 rounded-full"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-full"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* body */}
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
  const [open, setOpen] = useState(null);
  const matchedReceiverIds = new Set(Object.values(localMatches).filter(Boolean));

  const roleGlow = {
    FRONT_OF_HOUSE: "shadow-[0_0_12px_rgba(74,222,128,0.45)] ring-green-400/40",
    BACK_OF_HOUSE: "shadow-[0_0_12px_rgba(192,132,252,0.45)] ring-purple-400/40",
    OTHER: "shadow-[0_0_12px_rgba(96,165,250,0.45)] ring-blue-400/40",
  };

  const roleAccent = {
    FRONT_OF_HOUSE: "before:bg-green-400",
    BACK_OF_HOUSE: "before:bg-purple-400",
    OTHER: "before:bg-blue-400",
  };

  const roleText = {
    FRONT_OF_HOUSE: "text-green-300",
    BACK_OF_HOUSE: "text-purple-300",
    OTHER: "text-blue-300",
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 relative"
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-center drop-shadow-md">
        {title}
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => {
          const selectedId = localMatches[user.id];
          const selected = allUsers.find((u) => u.id === selectedId);
          const available = allUsers.filter(
            (u) => u.id !== user.id && !matchedReceiverIds.has(u.id)
          );

          const glow = roleGlow[user.role] || roleGlow.OTHER;
          const textColor = roleText[user.role] || roleText.OTHER;

          return (
            <div
              key={user.id}
              className={`relative bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-inner flex flex-col items-center text-center overflow-visible ${glow}`}
              style={{ zIndex: open === user.id ? 30 : 1 }}
            >
              <img
                src={user.profilePicture || "/default-profile.png"}
                alt={user.email}
                className="w-16 h-16 rounded-full border border-white/30 mb-2 object-cover shadow-sm"
              />
              <h3 className="font-semibold text-base truncate max-w-[200px]">
                {user.email}
              </h3>
              <p className={`text-xs mb-2 ${textColor}`}>
                {user.role.replaceAll("_", " ")}
              </p>

              {selected ? (
                <div className="mt-1 text-sm space-y-1">
                  <p className="opacity-90 font-medium">{selected.email}</p>
                  <p className="text-xs opacity-70 italic">
                    {selected.role.replaceAll("_", " ")}
                  </p>
                  <button
                    onClick={() => handleRemoveMatch(user.id)}
                    className="text-xs px-3 py-1 rounded-full bg-red-500/30 hover:bg-red-600/50 transition"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="relative mt-3 w-full overflow-visible">
                  <button
                    onClick={() =>
                      setOpen(open === user.id ? null : user.id)
                    }
                    className={`w-full flex justify-between items-center px-3 py-2 rounded-lg bg-white/10 text-white text-sm font-medium border border-white/20 backdrop-blur-sm hover:bg-white/20 transition ${glow}`}
                  >
                    <span>— Select Receiver —</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${open === user.id ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {open === user.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-full mt-2 z-40 w-full rounded-lg border border-white/10 bg-white/10 backdrop-blur-md shadow-[0_4px_18px_rgba(0,0,0,0.25)] overflow-hidden"
                        style={{
                          maxHeight: "8rem",
                          overflowY: "auto",
                          WebkitOverflowScrolling: "touch",
                        }}
                      >
                        {available.length === 0 && (
                          <div className="px-3 py-2 text-center text-xs text-white/60">
                            No available users
                          </div>
                        )}
                        {available.map((receiver) => {
                          const accent =
                            roleAccent[receiver.role] || roleAccent.OTHER;
                          return (
                            <button
                              key={receiver.id}
                              onClick={() => {
                                handleChange(user.id, receiver.id);
                                setOpen(null);
                              }}
                              className={`relative w-full text-left text-sm px-3 py-2 flex flex-col hover:bg-white/10 transition before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-4 rounded-md ${accent}`}
                            >
                              <span className="font-medium text-white truncate">
                                {receiver.email}
                              </span>
                              <span className="text-[11px] text-white/60">
                                {receiver.role.replaceAll("_", " ")}
                              </span>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
