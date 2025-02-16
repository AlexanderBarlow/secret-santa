import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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

  const handleRemoveUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this user?"
    );
    if (confirmDelete) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/api/admin/users/remove/${id}`
        );
        if (response.status === 200) {
          // Remove user from state
          setUsers(users.filter((user) => user.id !== id));
        } else {
          setError("Error removing user. Please try again.");
        }
      } catch (err) {
        console.error("Error removing user:", err);
        setError("Failed to remove user. Please try again.");
      }
    }
  };

  const handleAcceptUser = async (id) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/admin/users/accept",
        { id }
      );

      if (response.status === 200) {
        // Update the user state to reflect the accepted status
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

  return (
    <div className="flex flex-col justify-between min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex flex-col items-center flex-grow p-6">
        <h1 className="text-3xl font-semibold text-center mb-6 text-black">
          Admin Dashboard
        </h1>

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
              {users.map((user) => (
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
                  <p className="text-black text-sm truncate">
                    <strong>Password:</strong> {user.password}
                  </p>

                  {/* Display matchedSanta and wishlist */}
                  <div className="mt-4">
                    <h4 className="text-sm text-black font-semibold">
                      Matched Santa:
                    </h4>
                    <p className="text-black text-sm">
                      {user.matchedSanta || "N/A"}
                    </p>

                    <h4 className="text-sm text-black font-semibold mt-2">
                      Wishlist:
                    </h4>
                    <ul className="list-disc pl-5">
                      {user.wishlist && user.wishlist.length > 0 ? (
                        user.wishlist.map((item, index) => (
                          <li key={index} className="text-black text-sm">
                            {item}
                          </li>
                        ))
                      ) : (
                        <li className="text-black text-sm">
                          No items in wishlist.
                        </li>
                      )}
                    </ul>

                    {/* Accepted Status with Highlighting */}
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
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveUser(user.id)}
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

      {/* Bottom Navigation Bar */}
      <AdminNavbar />
    </div>
  );
}
