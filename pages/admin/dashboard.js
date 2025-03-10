import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";
import UserCard from "../../components/UserCard";
import SkeletonCard from "../../components/SkeletonCard";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortAcceptedFirst, setSortAcceptedFirst] = useState(true);
  const [filter, setFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get("/api/admin/users");

        if (Array.isArray(usersResponse.data)) {
          setUsers(usersResponse.data || []);
        } else {
          console.error("Unexpected data format:", usersResponse.data);
          setUsers([]);
        }
      } catch (err) {
        console.error("Error fetching data", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Accept User Function
  const handleAcceptUser = async (userId) => {
    try {
      const response = await axios.post("/api/admin/users/accept", {
        id: userId,
      });

      if (response.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, Accepted: true } : user
          )
        );
      } else {
        setError("Error accepting user. Please try again.");
      }
    } catch (err) {
      console.error("Error accepting user:", err);
      setError("Failed to accept user. Please try again.");
    }
  };

  // Delete User Function
  const openDeleteModal = (id) => {
    setUserToDelete(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setUserToDelete(null);
  };

  const handleRemoveUser = async () => {
    if (!userToDelete) return;

    try {
      const response = await axios.delete(
        `/api/admin/users/remove/${userToDelete}`
      );
      if (response.status === 200) {
        setUsers(users.filter((user) => user.id !== userToDelete));
        closeModal();
      } else {
        setError("Error removing user. Please try again.");
      }
    } catch (err) {
      console.error("Error removing user:", err);
      setError("Failed to remove user. Please try again.");
    }
  };

  // Apply sorting
  const sortedUsers = [...users].sort((a, b) =>
    sortAcceptedFirst ? b.Accepted - a.Accepted : a.Accepted - b.Accepted
  );

  // Apply filtering
  const filteredUsers = sortedUsers.filter((user) => {
    const role = user.role ? user.role.toLowerCase() : "";
    if (filter === "pending") return !user.Accepted;
    if (filter === "backOfHouse")
      return role.includes("back") || role === "boh";
    if (filter === "frontOfHouse")
      return role.includes("front") || role === "foh";
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex flex-col items-center flex-grow p-6">
        <h1 className="text-4xl font-bold text-center mb-6 text-black">
          Admin Dashboard
        </h1>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-6">
          {/* Sort Button */}

          {/* Filter Dropdown */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-3 rounded-full bg-white border border-gray-300 shadow-md text-black focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="all">All Users</option>
            <option value="pending">Pending Users</option>
            <option value="backOfHouse">Back of House</option>
            <option value="frontOfHouse">Front of House</option>
          </select>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <h2 className="text-2xl mb-4 text-black text-center">
          {filteredUsers.length > 0
            ? `Total Users: ${filteredUsers.length}`
            : "No users available."}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {loading
            ? [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
            : filteredUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  handleAcceptUser={handleAcceptUser}
                  openDeleteModal={openDeleteModal} // ✅ Ensure delete function is passed
                />
              ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
            <h2 className="text-xl font-semibold mb-4 text-black">
              Confirm Deletion
            </h2>
            <p className="text-black mb-4">
              Are you sure you want to remove this user? This action cannot be
              undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleRemoveUser}
                className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600"
              >
                Yes, Remove
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-black rounded shadow hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminNavbar />
    </div>
  );
}
