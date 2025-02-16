import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortAcceptedFirst, setSortAcceptedFirst] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get(
          "http://localhost:3000/api/admin/users"
        );
        if (usersResponse.status === 200) {
          setUsers(usersResponse.data);
        } else {
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

  // Open Modal and Set User for Deletion
  const openDeleteModal = (id) => {
    setUserToDelete(id);
    setIsModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setUserToDelete(null);
  };

  // Handle User Deletion
  const handleRemoveUser = async () => {
    if (!userToDelete) return;

    try {
      const response = await axios.delete(
        `http://localhost:3000/api/admin/users/remove/${userToDelete}`
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

  // Handle Accepting User
  const handleAcceptUser = async (id) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/admin/users/accept",
        { id }
      );

      if (response.status === 200) {
        setUsers(
          users.map((user) =>
            user.id === id ? { ...user, Accepted: true } : user
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

  // Sorting Function
  const sortedUsers = [...users].sort((a, b) =>
    sortAcceptedFirst ? b.Accepted - a.Accepted : a.Accepted - b.Accepted
  );

  return (
    <div className="flex flex-col justify-between min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex flex-col items-center flex-grow p-6">
        <h1 className="text-3xl font-semibold text-center mb-6 text-black">
          Admin Dashboard
        </h1>

        {/* Sorting Button */}
        <button
          onClick={() => setSortAcceptedFirst(!sortAcceptedFirst)}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
        >
          {sortAcceptedFirst ? "Show Pending First" : "Show Accepted First"}
        </button>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Loading Indicator */}
        {loading ? (
          <p className="text-center text-black">Admin Dashboard Loading...</p>
        ) : (
          <>
            <h2 className="text-xl mb-4 text-black text-center">
              {users.length > 0
                ? `Total Users: ${users.length}`
                : "No users available."}
            </h2>

            {/* User Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
              {sortedUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white p-6 rounded-lg shadow-md border border-gray-300 flex flex-col justify-between min-h-[230px] break-words"
                >
                  <h3 className="text-lg font-semibold text-black mb-2 truncate">
                    User ID: {user.id}
                  </h3>
                  <p className="text-black text-sm break-words">
                    <strong>Email:</strong> {user.email}
                  </p>

                  {/* Matched Santa */}
                  <h4 className="text-sm text-black font-semibold mt-2">
                    Matched Santa:
                  </h4>
                  <p className="text-black text-sm">
                    {user.matchedSanta || "N/A"}
                  </p>

                  {/* Wishlist */}
                  <h4 className="text-sm text-black font-semibold mt-2">
                    Wishlist:
                  </h4>
                  <ul className="list-disc pl-5">
                    {user.wishlist && user.wishlist.items.length > 0 ? (
                      user.wishlist.items.map((item, index) => (
                        <li key={index} className="text-black text-sm">
                          {item.item}
                        </li>
                      ))
                    ) : (
                      <li className="text-black text-sm">
                        No items in wishlist.
                      </li>
                    )}
                  </ul>

                  {/* Accepted Status */}
                  <h4 className="text-sm text-black font-semibold mt-2">
                    Accepted Status:
                  </h4>
                  <p
                    className={`text-sm font-semibold p-2 rounded mt-1 ${
                      user.Accepted
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {user.Accepted ? "Accepted" : "Pending"}
                  </p>

                  {/* Remove Button */}
                  <button
                    onClick={() => openDeleteModal(user.id)}
                    className="w-full py-3 mt-4 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Remove User
                  </button>

                  {/* Accept Button */}
                  <button
                    onClick={() => handleAcceptUser(user.id)}
                    className="w-full py-3 mt-4 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Accept User
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Custom Delete Confirmation Modal */}
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

      {/* Bottom Navigation Bar */}
      <AdminNavbar />
    </div>
  );
}
