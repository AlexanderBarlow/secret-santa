"use client";
import React, { useState, useEffect, memo, useRef, useLayoutEffect } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";
import { Loader2, Shuffle, Save, UserX } from "lucide-react";

export default function MatchSantaPage() {
  const [users, setUsers] = useState([]);
  const [localMatches, setLocalMatches] = useState([]);
  const [roleGroups, setRoleGroups] = useState({ FOH: [], BOH: [] });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const scrollPos = useRef(0);

  // Restore scroll after updates
  useLayoutEffect(() => {
    window.scrollTo({ top: scrollPos.current, behavior: "instant" });
  }, [localMatches]);

  const saveScroll = () => {
    scrollPos.current = window.scrollY;
  };

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/admin/users");
        setUsers(res.data);
        const foh = res.data.filter((u) => u.role === "FRONT_OF_HOUSE");
        const boh = res.data.filter((u) => u.role === "BACK_OF_HOUSE");
        setRoleGroups({ FOH: foh, BOH: boh });
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Shuffle helper
  const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

  // Generate Matches
  const handleGenerateMatches = () => {
    saveScroll();
    const gen = (group) => {
      if (group.length < 2) return [];
      const s = shuffleArray([...group]);
      return s.map((giver, i) => ({
        giver,
        receiver: s[(i + 1) % s.length],
      }));
    };
    setLocalMatches([...gen(roleGroups.FOH), ...gen(roleGroups.BOH)]);
    setMessage("🎁 Matches generated locally! You can edit before saving.");
  };

  // Unpair
  const handleUnpair = (giverId) => {
    saveScroll();
    setLocalMatches((p) =>
      p.map((m) =>
        m.giver.id === giverId ? { ...m, receiver: null } : m
      )
    );
  };

  // Reassign
  const handleReassign = (giverId, receiverId) => {
    saveScroll();
    const receiver = users.find((u) => u.id === Number(receiverId));
    setLocalMatches((p) =>
      p.map((m) =>
        m.giver.id === giverId ? { ...m, receiver } : m
      )
    );
  };

  // Save
  const handleSaveMatches = async () => {
    saveScroll();
    setLoading(true);
    try {
      await axios.post("/api/admin/users/selectmatch", {
        matches: localMatches
          .filter((m) => m.receiver)
          .map((m) => ({
            giverId: m.giver.id,
            receiverId: m.receiver.id,
          })),
      });
      setMessage("✅ Matches saved successfully!");
    } catch (err) {
      console.error("Error saving matches:", err);
      setMessage("❌ Failed to save matches.");
    } finally {
      setLoading(false);
    }
  };

  // Match Card
  const MatchCard = memo(({ giver, receiver }) => {
    const alreadyMatchedIds = new Set(
      localMatches.filter((m) => m.receiver?.id).map((m) => m.receiver.id)
    );

    const availableReceivers = users.filter(
      (u) =>
        u.role === giver.role &&
        u.id !== giver.id &&
        (!alreadyMatchedIds.has(u.id) || receiver?.id === u.id)
    );

    return (
      <div
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 text-white shadow-lg transition-transform hover:scale-[1.02]"
      >
        <div className="flex items-center gap-4 mb-4">
          <img
            src={giver.profilePicture || "/default-profile.png"}
            alt={giver.email}
            className="w-14 h-14 rounded-full border border-white/30 object-cover"
          />
          <div>
            <p className="font-semibold text-lg break-words">{giver.email}</p>
            <p className="text-sm opacity-70">
              🎁 Assigned to:{" "}
              {receiver?.email ? (
                <span className="text-white/90">{receiver.email}</span>
              ) : (
                <span className="text-white/50">Not yet matched</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            className="flex-1 bg-white/20 border border-white/30 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
            value={receiver?.id || ""}
            onChange={(e) => handleReassign(giver.id, e.target.value)}
            onFocus={saveScroll} // preserve scroll when focusing
          >
            <option value="">Select Receiver</option>
            {availableReceivers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.email}
              </option>
            ))}
          </select>

          <button
            onClick={() => handleUnpair(giver.id)}
            className={`w-10 h-10 rounded-full ${receiver
                ? "bg-red-500/30 hover:bg-red-500/50"
                : "bg-gray-500/20 cursor-not-allowed"
              } border border-white/30 flex items-center justify-center transition-all duration-200`}
            disabled={!receiver}
          >
            <UserX className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    );
  });

  // Role section
  const RoleSection = ({ title, roleMatches }) => (
    <section className="w-full mb-10">
      <h2 className="text-2xl font-bold text-center mb-6 text-white/90">
        {title} 🎄
      </h2>
      {roleMatches.length === 0 ? (
        <p className="text-center text-white/60">
          No matches yet — click “Generate Matches”
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {roleMatches.map(({ giver, receiver }) => (
            <MatchCard
              key={giver.id}
              giver={giver}
              receiver={receiver}
            />
          ))}
        </div>
      )}
    </section>
  );

  return (
    <main
      className="min-h-screen w-full bg-gradient-to-br from-[#1a1a40] via-[#4054b2] to-[#1b1b2f] text-white flex flex-col items-center pb-24 px-4 overflow-x-hidden overflow-y-auto"
      style={{ overscrollBehavior: "contain" }}
    >
      {/* Header */}
      <header className="text-center mt-10 mb-8 z-10 sticky top-0 bg-gradient-to-br from-[#1a1a40]/90 via-[#4054b2]/80 to-[#1b1b2f]/90 backdrop-blur-md py-4 rounded-xl w-full max-w-3xl shadow-md">
        <h1 className="text-3xl sm:text-4xl font-bold drop-shadow-md">
          Match Santa 🎅
        </h1>
        <p className="opacity-80 mt-1 text-sm sm:text-base">
          Generate, edit, and save Secret Santa matches
        </p>
      </header>

      {message && (
        <p className="text-center text-green-400 font-medium mb-4 bg-white/10 py-2 px-4 rounded-full backdrop-blur-md">
          {message}
        </p>
      )}

      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-10 z-10">
        <button
          onClick={handleGenerateMatches}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 hover:bg-white/30 border border-white/40 backdrop-blur-md shadow-lg font-semibold transition-all duration-200"
        >
          <Shuffle className="w-5 h-5" /> Generate Matches
        </button>
        <button
          onClick={handleSaveMatches}
          disabled={loading || localMatches.length === 0}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-green-500/30 hover:bg-green-500/50 border border-white/40 backdrop-blur-md shadow-lg font-semibold transition-all duration-200"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Save className="w-5 h-5" /> Save Matches
            </>
          )}
        </button>
      </div>

      <RoleSection
        title="Front of House"
        roleMatches={localMatches.filter(
          (m) => m.giver.role === "FRONT_OF_HOUSE"
        )}
      />
      <RoleSection
        title="Back of House"
        roleMatches={localMatches.filter(
          (m) => m.giver.role === "BACK_OF_HOUSE"
        )}
      />

      <AdminNavbar />
    </main>
  );
}
