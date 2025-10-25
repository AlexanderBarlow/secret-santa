"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";
import UserCard from "../../components/UserCard";
import SkeletonCard from "../../components/SkeletonCard";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/admin/users");
        if (Array.isArray(res.data)) setUsers(res.data);
        else setUsers([]);
      } catch {
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAcceptUser = async (userId) => {
    try {
      const res = await axios.post("/api/admin/users/accept", { id: userId });
      if (res.status === 200) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, Accepted: true } : u))
        );
      }
    } catch {
      setError("Error accepting user.");
    }
  };

  const openDeleteModal = (id) => {
    setUserToDelete(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setUserToDelete(null);
  };

  const handleRemoveUser = async () => {
    try {
      const res = await axios.delete(`/api/admin/users/remove/${userToDelete}`);
      if (res.status === 200) {
        setUsers(users.filter((u) => u.id !== userToDelete));
        closeModal();
      }
    } catch {
      setError("Failed to remove user.");
    }
  };

  // 🧮 Filtered + pending counts
  const filteredUsers = users.filter((user) => {
    const role = (user.role || "").toLowerCase();
    const isAccepted = Boolean(user.Accepted ?? user.accepted);

    switch (filter) {
      case "pending":
        return !isAccepted;
      case "backOfHouse":
        return role.includes("back") || role === "boh";
      case "frontOfHouse":
        return role.includes("front") || role === "foh";
      default:
        return true;
    }
  });


  const pendingCount = users.filter((u) => !u.Accepted).length;

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-[#1a1a40] via-[#4054b2] to-[#1b1b2f] text-white overflow-hidden">
      {/* ✨ Gentle Snow Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-60 blur-[1px]"
            initial={{ y: -10, x: Math.random() * window.innerWidth }}
            animate={{
              y: "110vh",
              x: `+=${(Math.random() - 0.5) * 60}`,
              opacity: [0.8, 0.4, 0.8],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* 🎄 Header */}
      {/* 🎄 Header */}
      <header className="relative z-10 text-center mt-6 sm:mt-10 px-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-red-500 via-pink-300 to-green-400 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(255,255,255,0.3)] leading-tight">
          Admin Dashboard 🎅
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mt-3 text-sm sm:text-lg text-white/80 max-w-lg mx-auto backdrop-blur-md bg-white/10 border border-white/20 px-4 py-2 rounded-full shadow-inner"
        >
          Manage users, approvals, and roles in your Secret Santa event.
        </motion.p>

        <div className="w-16 sm:w-24 h-1 mt-4 mx-auto bg-gradient-to-r from-red-500 via-white to-green-500 rounded-full shadow-lg"></div>

        {/* 🎁 Pending Count (smaller + conditional) */}
        {pendingCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-5 inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 sm:py-2.5 
                 bg-white/10 border border-white/25 backdrop-blur-xl rounded-full shadow-md"
          >
            <span className="text-sm sm:text-base font-medium text-white/90">
              🕒 Pending Users:
            </span>
            <motion.span
              key={pendingCount}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1.05, opacity: 1 }}
              transition={{ type: "spring", stiffness: 150, damping: 10 }}
              className={`text-lg sm:text-xl font-extrabold px-3 py-0.5 rounded-lg shadow 
                   ${
                     pendingCount > 0
                       ? "bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400 text-transparent bg-clip-text drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]"
                       : "text-green-300"
                   }`}
            >
              {pendingCount}
            </motion.span>
          </motion.div>
        )}
      </header>

      {/* 🔍 Filters */}
      <div className="relative z-10 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center mt-8 px-4">
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-6 py-2 sm:px-8 sm:py-3 rounded-full
                 bg-gradient-to-r from-[#2b2b6b]/80 via-[#3b3b8f]/70 to-[#2b2b6b]/80
                 text-white font-semibold backdrop-blur-xl
                 border border-white/30 shadow-[0_4px_25px_rgba(255,255,255,0.15)]
                 focus:ring-2 focus:ring-pink-300 focus:outline-none
                 appearance-none transition-all duration-300
                 hover:shadow-[0_0_15px_rgba(255,255,255,0.25)]"
          >
            <option value="all" className="bg-[#1a1a40] text-white">
              🎅 All Users
            </option>
            <option value="pending" className="bg-[#1a1a40] text-white">
              🕒 Pending Users
            </option>
            <option value="backOfHouse" className="bg-[#1a1a40] text-white">
              👨‍🍳 Back of House
            </option>
            <option value="frontOfHouse" className="bg-[#1a1a40] text-white">
              ☕ Front of House
            </option>
          </select>

          {/* Custom dropdown arrow */}
          <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-white/80">
            ▼
          </div>
        </div>
      </div>

      {/* ⚠️ Error */}
      {error && (
        <p className="text-red-400 text-center relative z-10 font-medium text-sm sm:text-base mt-4 px-4">
          {error}
        </p>
      )}

      {/* 👥 User Count */}
      <h2 className="relative z-10 text-lg sm:text-2xl mb-6 text-center text-white/80 mt-6">
        {filteredUsers.length > 0
          ? `🎁 Total Users: ${filteredUsers.length}`
          : "No users found."}
      </h2>

      {/* 🧑‍💼 User Cards */}
      <motion.div
        layout
        className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 w-full max-w-6xl mx-auto px-3 sm:px-4 pb-28 sm:pb-24"
      >
        {loading
          ? [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
          : filteredUsers.map((user, i) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <UserCard
                  user={user}
                  handleAcceptUser={handleAcceptUser}
                  openDeleteModal={openDeleteModal}
                />
              </motion.div>
            ))}
      </motion.div>

      {/* 🗑️ Delete Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 sm:p-8 rounded-2xl shadow-2xl max-w-sm sm:max-w-md w-full text-center text-white"
            >
              <h2 className="text-lg sm:text-xl font-semibold mb-3 text-red-300">
                Confirm Deletion
              </h2>
              <p className="text-white/80 mb-6 text-sm sm:text-base">
                Are you sure you want to remove this user? This action cannot be
                undone.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRemoveUser}
                  className="px-6 py-2 bg-red-500/70 hover:bg-red-600/90 text-white rounded-full shadow-md transition"
                >
                  Yes, Remove
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeModal}
                  className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full shadow-md transition"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AdminNavbar />
    </div>
  );
}
