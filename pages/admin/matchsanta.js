import { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar"; // Import AdminNavbar
import Select from "react-select"; // Enhanced dropdown UI

export default function MatchSantaPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [matches, setMatches] = useState([]); // Holds the matches
  const [unpaired, setUnpaired] = useState([]); // Holds unpaired users
  const [users, setUsers] = useState([]); // All users

  // Fetch users and initialize unpaired list
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/admin/users"); // Endpoint to get all users
        setUsers(response.data); // Set the users directly

        // Filter out users who already have a match (e.g., matchedSanta or receiver)
        const unpairedUsers = response.data.filter(
          (user) => !user.matchedSanta && !user.matchedBy
        );

        setUnpaired(unpairedUsers); // Set unpaired users list
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

const handleMatchUsers = async () => {
  setLoading(true);
  setMessage(""); // Reset message before request

  try {
    const response = await axios.post("/api/admin/users/matchusers");
    if (response.status === 200) {
      setMessage("Users have been successfully matched!");

      // Fetch updated users after matching
      const updatedUsersResponse = await axios.get("/api/admin/users");
      const updatedUsers = updatedUsersResponse.data;

      setUsers(updatedUsers); // Update users with new data

      // Extract paired user emails or IDs for comparison
      const pairedUserEmails = updatedUsers
        .filter((user) => user.matchedSanta || user.matchedBy)
        .map((user) => user.email);

      // Filter unpaired users based on their email
      setUnpaired(
        updatedUsers.filter((user) => !pairedUserEmails.includes(user.email))
      );
    } else {
      setMessage("An error occurred during the matching process.");
    }
  } catch (error) {
    setMessage("An error occurred during the matching process.");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Main Content Wrapper */}
      <div className="flex flex-grow justify-center items-center p-8">
        <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl text-red-500 font-semibold text-center mb-6">
            Match Santa
          </h1>

          <button
            onClick={handleMatchUsers}
            disabled={loading}
            className="w-full py-3 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {loading ? "Matching..." : "Generate Matches"}
          </button>

          {/* Matches Container */}
          <div className="flex justify-center items-start mt-6 px-4">
            <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
                Matched Results
              </h2>

              {/* Matches Section */}
              {users.length > 0 ? (
                <div className="mt-6">
                  <h2 className="text-xl font-semibold text-center text-black">
                    Matched Users
                  </h2>
                  <ul className="mt-4 space-y-4">
                    {users.map((users, index) => (
                      <li
                        key={index}
                        className="bg-gray-50 p-4 rounded-lg shadow-md"
                      >
                        <div className="flex justify-between items-center">
                          <div className="text-black font-semibold">
                            {users.matchedSanta?.email || "No giver"}
                          </div>
                          <span className="text-gray-500 text-xl">→</span>
                          <div className="text-black">
                            {users.matchedBy?.email || "No receiver"}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-center text-gray-500 mt-6">
                  Start matching now to generate Santa pairs!
                </p>
              )}

              {/* Unpaired Users */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-center text-black">
                  Unpaired Users
                </h2>
                {unpaired?.length > 0 ? (
                  <ul className="mt-4 list-disc pl-6">
                    {unpaired.map((user, index) => (
                      <li key={index} className="text-black">
                        {user.email}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-center text-gray-500">
                    All users are paired.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Navbar */}
      <AdminNavbar />
    </div>
  );
}
