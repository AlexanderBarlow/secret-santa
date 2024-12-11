import { useState } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar"; // Import AdminNavbar

export default function MatchSantaPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [matches, setMatches] = useState([]); // To hold the matches

  const handleMatchUsers = async () => {
    setLoading(true);
    setMessage(""); // Reset message before request

    try {
      // Trigger the matching API endpoint
      const response = await axios.post("/api/admin/users/matchusers");
      console.log(response);

      if (response.status === 200) {
        setMessage("Users have been successfully matched!");
        setMatches(response.data.matches); // Set the matches received from the API
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
    <div className="flex flex-col min-h-screen bg-gray-100 relative">
      {/* Admin Navbar */}
      <AdminNavbar />

      {/* Large Round Button */}
      <div className="relative flex justify-center items-center mt-12">
        <button
          onClick={handleMatchUsers}
          disabled={loading}
          className="w-28 h-28 bg-red-500 text-white rounded-full shadow-md text-lg font-semibold hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 z-10"
        >
          {loading ? "Loading..." : "Generate"}
        </button>
        {/* Decorative Line */}
        <div className="w-full border-t-4 border-gray-300 absolute top-14">
          <div className="absolute -top-2 left-[50%] transform -translate-x-[50%] bg-gray-100 w-28 h-6 rounded-b-full"></div>
        </div>
      </div>

      {/* Matches Container */}
      <div className="flex justify-center items-start mt-16 px-4">
        <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
            Matched Results
          </h2>

          {message && (
            <p
              className={`mb-6 text-center ${
                message.includes("Error") ? "text-red-500" : "text-green-500"
              }`}
            >
              {message}
            </p>
          )}

          {matches.length > 0 ? (
            <ul className="space-y-4">
              {matches.map((match, index) => (
                <li
                  key={index}
                  className="p-4 bg-gray-100 rounded-lg shadow-sm text-gray-800"
                >
                  <span className="font-bold">{match.giver}</span> is buying for{" "}
                  <span className="font-bold">{match.receiver}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">
              No matches yet. Click "Generate" to create matches.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
