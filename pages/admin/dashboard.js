"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";
import UserCard from "../../components/UserCard";
import SkeletonCard from "../../components/SkeletonCard";
import { motion, AnimatePresence } from "framer-motion";
import useAuthCheck from "../../utils/useAuthCheck";

export default function Dashboard() {
  const authStatus = useAuthCheck();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Redirect if session expired
  useEffect(() => {
    if (authStatus === "expired") {
      const timer = setTimeout(() => {
        window.location.href = "/auth/signin";
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [authStatus]);

  // Fetch all users
  useEffect(() => {
    if (authStatus !== "valid") return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return (window.location.href = "/auth/signin");

        const res = await axios.get("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(res.data)) setUsers(res.data);
        else setUsers([]);
      } catch (err) {
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authStatus]);

  // Accept user action
  const handleAcceptUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/admin/users/accept",
        { id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, Accepted: true } : u
          )
        );
      }
    } catch {
      setError("Error accepting user.");
    }
  };

  // Delete modal
  const openDeleteModal = (id) => {
    setUserToDelete(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setUserToDelete(null);
  };

  // Remove user
  const handleRemoveUser = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.delete(
        `/api/admin/users/remove/${userToDelete}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        setUsers(users.filter((u) => u.id !== userToDelete));
        closeModal();
      }
    } catch {
      setError("Failed to remove user.");
    }
  };

  // -------------------------------------------------------------------------
  // ⭐ FILTERING LOGIC (✨ FIXED FOR YOUR PRISMA STRUCTURE)
  // -------------------------------------------------------------------------
  const filteredUsers = users.filter((user) => {
    const role = (user.role || "").toLowerCase();
    const isAccepted = Boolean(user.Accepted ?? user.accepted);

    // Prisma structure: wishlist = { items: [...] }
    const hasNoWishlistItems =
      !user.wishlist || // No wishlist object
      !Array.isArray(user.wishlist.items) || // No items array
      user.wishlist.items.length === 0; // Empty items

    switch (filter) {
      case "pending":
        return !isAccepted;

      case "backOfHouse":
        return role.includes("back") || role === "boh";

      case "frontOfHouse":
        return role.includes("front") || role === "foh";

      case "noWishlist":
        return hasNoWishlistItems;

      default:
        return true;
    }
  });

  const pendingCount = users.filter((u) => !u.Accepted).length;

  // Session UI
  if (authStatus === "checking") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#0b1437] text-white text-lg font-bold">
        Checking session...
      </div>
    );
  }

  if (authStatus === "expired") {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-red-800 via-red-700 to-red-600 text-white text-center p-6">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-extrabold mb-3"
        >
          🎁 SESSION EXPIRED 🎁
        </motion.h1>
        <p>Please sign in again.</p>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // MAIN DASHBOARD RENDER
  // -------------------------------------------------------------------------
  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-[#1a1a40] via-[#4054b2] to-[#1b1b2f] text-white overflow-hidden">

      {/* Snow Animation */}
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

      {/* Header */}
      <header className="relative z-10 text-center mt-6 px-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-red-500 via-pink-300 to-green-400 bg-clip-text text-transparent">
          Admin Dashboard 🎅
        </h1>

        <p className="mt-3 text-sm sm:text-lg text-white/80 max-w-lg mx-auto bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/20">
          Manage users, approvals, and roles in your Secret Santa event.
        </p>

        {pendingCount > 0 && (
          <div className="mt-5 inline-flex items-center gap-2 px-5 py-2 bg-white/10 rounded-full shadow border border-white/20 backdrop-blur-xl">
            <span>🕒 Pending Users:</span>
            <span className="text-xl font-extrabold text-yellow-300">
              {pendingCount}
            </span>
          </div>
        )}
      </header>

      {/* Filters */}
      <div className="relative z-10 flex flex-col sm:flex-row gap-3 items-center justify-center mt-8 px-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-[#2b2b6b] via-[#3b3b8f] to-[#2b2b6b] text-white font-semibold border border-white/30"
        >
          <option value="all">🎅 All Users</option>
          <option value="pending">🕒 Pending Users</option>
          <option value="backOfHouse">👨‍🍳 Back of House</option>
          <option value="frontOfHouse">☕ Front of House</option>
          <option value="noWishlist">🎁 No Wishlist</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-400 text-center z-10 mt-4">{error}</p>
      )}

      {/* User Count */}
      <h2 className="relative z-10 text-lg sm:text-2xl mb-6 text-center text-white/80 mt-6">
        {filteredUsers.length > 0
          ? `🎁 Total Users: ${filteredUsers.length}`
          : "No users found."}
      </h2>

      {/* User Cards */}
      <motion.div
        layout
        className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 pb-28"
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

      {/* Delete Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center text-white"
            >
              <h2 className="text-xl font-semibold mb-3 text-red-300">
                Confirm Deletion
              </h2>
              <p className="text-white/80 mb-6">
                Are you sure you want to remove this user?
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={handleRemoveUser}
                  className="px-6 py-2 bg-red-600 rounded-full"
                >
                  Yes, Remove
                </button>
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-white/20 rounded-full"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AdminNavbar />
    </div>
  );
}
