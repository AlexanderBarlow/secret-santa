import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";
import UserCard from "../../components/UserCard";
import SkeletonCard from "../../components/SkeletonCard";
import { motion } from "framer-motion";

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

  const filteredUsers = users.filter((user) => {
    const role = user.role ? user.role.toLowerCase() : "";
    if (filter === "pending") return !user.Accepted;
    if (filter === "backOfHouse")
      return role.includes("back") || role === "boh";
    if (filter === "frontOfHouse")
      return role.includes("front") || role === "foh";
    return true;
  });

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-[#eaf2f8] via-[#f9fafc] to-[#ffffff] text-gray-800 overflow-hidden">
      {/* ❄️ Animated Snowfall */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-70 blur-sm"
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
      <header className="relative z-10 flex flex-col items-center text-center mt-6 sm:mt-10 px-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-[#c41e3a] via-[#ff4b2b] to-[#007f5f] bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(255,255,255,0.25)] leading-tight">
          Admin Dashboard 🎅
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mt-3 max-w-md sm:max-w-xl text-center"
        >
          <p className="text-sm sm:text-lg font-medium text-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-full bg-white/40 shadow-inner border border-white/20">
            ❄ Manage users, approvals, and events — all wrapped in Christmas
            cheer.
          </p>
        </motion.div>

        <div className="w-16 sm:w-24 h-1 mt-4 bg-gradient-to-r from-red-500 via-white to-green-500 rounded-full shadow-lg"></div>
      </header>

      {/* 🔍 Filters */}
      <div className="relative z-10 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center mb-8 mt-6 px-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-5 py-2 sm:px-6 sm:py-3 rounded-full bg-white/70 backdrop-blur-lg border border-gray-200 shadow-md text-sm sm:text-base text-gray-800 focus:ring-2 focus:ring-red-400 focus:outline-none transition"
        >
          <option value="all">All Users</option>
          <option value="pending">Pending Users</option>
          <option value="backOfHouse">Back of House</option>
          <option value="frontOfHouse">Front of House</option>
        </select>
      </div>

      {/* ⚠️ Error */}
      {error && (
        <p className="text-red-500 text-center relative z-10 font-medium text-sm sm:text-base px-4">
          {error}
        </p>
      )}

      {/* 👥 User Count */}
      <h2 className="relative z-10 text-xl sm:text-2xl mb-6 text-center text-gray-700 px-4">
        {filteredUsers.length > 0
          ? `Total Users: ${filteredUsers.length}`
          : "No users found."}
      </h2>

      {/* 🧑‍💼 User Cards */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-6xl mx-auto px-3 sm:px-4 pb-28 sm:pb-24">
        {loading
          ? [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
          : filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                handleAcceptUser={handleAcceptUser}
                openDeleteModal={openDeleteModal}
              />
            ))}
      </div>

      {/* 🗑️ Delete Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white/95 backdrop-blur-lg border border-gray-200 p-6 sm:p-8 rounded-2xl shadow-2xl max-w-sm sm:max-w-md w-full text-center"
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
              Confirm Deletion
            </h2>
            <p className="text-gray-700 mb-6 text-sm sm:text-base">
              Are you sure you want to remove this user? This action cannot be
              undone.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <button
                onClick={handleRemoveUser}
                className="px-6 py-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition"
              >
                Yes, Remove
              </button>
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-full shadow hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <AdminNavbar />
    </div>
  );
}
