import { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";

export default function SetAdminCode() {
  const [adminCode, setAdminCode] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [matchSantaDate, setMatchSantaDate] = useState("");
  const [overview, setOverview] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [currentCode, setCurrentCode] = useState("");
  const [currentEventDate, setCurrentEventDate] = useState("");
  const [currentMatchSantaDate, setCurrentMatchSantaDate] = useState("");
  const [currentOverview, setCurrentOverview] = useState("");

  // Fetch the current admin details when the component mounts
  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const response = await axios.get("/api/admin/users/adduser");
        const { code, eventDate, matchSantaDate, overview } = response.data;
        setCurrentCode(code);
        setCurrentEventDate(eventDate);
        setCurrentMatchSantaDate(matchSantaDate);
        setCurrentOverview(overview);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch admin details.");
      }
    };

    fetchAdminDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Collect only the fields that have been changed
    const updatedFields = {};
    if (adminCode.trim() && adminCode !== currentCode)
      updatedFields.adminCode = adminCode;
    if (eventDate.trim() && eventDate !== currentEventDate)
      updatedFields.eventDate = eventDate;
    if (matchSantaDate.trim() && matchSantaDate !== currentMatchSantaDate)
      updatedFields.matchSantaDate = matchSantaDate;
    if (overview.trim() && overview !== currentOverview)
      updatedFields.overview = overview;

    // Prevent API call if no changes are made
    if (Object.keys(updatedFields).length === 0) {
      setError("No changes detected.");
      return;
    }

    try {
      // Send only changed fields to the API
      await axios.post("/api/admin/users/adduser", updatedFields);
      setSuccess(true);

      // Fetch updated details after submission
      const response = await axios.get("/api/admin/users/adduser");
      const { code, eventDate, matchSantaDate, overview } = response.data;
      setCurrentCode(code);
      setCurrentEventDate(eventDate);
      setCurrentMatchSantaDate(matchSantaDate);
      setCurrentOverview(overview);

      // Clear only the fields that were changed
      setAdminCode("");
      setEventDate("");
      setMatchSantaDate("");
      setOverview("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save admin details.");
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-screen bg-gray-100">
      <div className="flex justify-center items-center flex-grow space-x-10">
        {/* Left Side: Form */}
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-3xl font-semibold text-center mb-6 text-black">
            Set Admin Details
          </h1>

          {/* Error Message */}
          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* Success Message */}
          {success && (
            <p className="text-green-500 text-center mb-4">
              Admin details saved successfully!
            </p>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Admin Code */}
            <div className="mb-4">
              <label className="block text-black font-semibold mb-2">
                Admin Code
              </label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder={currentCode || "Enter admin code"}
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
              />
            </div>

            {/* Event Date */}
            <div className="mb-4">
              <label className="block text-black font-semibold mb-2">
                Event Date
              </label>
              <input
                type="date"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />
            </div>

            {/* Match Santa Date */}
            <div className="mb-4">
              <label className="block text-black font-semibold mb-2">
                Match Santa Date
              </label>
              <input
                type="date"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                value={matchSantaDate}
                onChange={(e) => setMatchSantaDate(e.target.value)}
              />
            </div>

            {/* Overview */}
            <div className="mb-4">
              <label className="block text-black font-semibold mb-2">
                Overview
              </label>
              <textarea
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder={currentOverview || "Enter event overview"}
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                rows={4}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-800 transition"
            >
              Save Admin Details
            </button>
          </form>
        </div>

        {/* Right Side: Current Admin Details */}
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-6 text-black">
            Current Event Details
          </h2>

          <div className="text-center mb-4">
            <p className="text-black">
              <strong>Admin Code:</strong>{" "}
              <span className="text-red-600 font-bold">{currentCode}</span>
            </p>
            <p className="text-black">
              <strong>Event Date:</strong>{" "}
              <span className="text-red-600 font-bold">
                {currentEventDate
                  ? new Date(currentEventDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Not Set"}
              </span>
            </p>
            <p className="text-black">
              <strong>Match Santa Date:</strong>{" "}
              <span className="text-red-600 font-bold">
                {currentMatchSantaDate
                  ? new Date(currentMatchSantaDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )
                  : "Not Set"}
              </span>
            </p>

            <p className="text-black">
              <strong>Overview:</strong>{" "}
              <span className="text-red-600 font-bold">
                {currentOverview || "Not Set"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Admin Navbar */}
      <AdminNavbar />
    </div>
  );
}
