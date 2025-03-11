import { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "../../components/AdminNavbar";
import { Loader2 } from "lucide-react"; // Loading icon for better UX

export default function MatchSantaPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [unpaired, setUnpaired] = useState([]);
  const [selectedReceivers, setSelectedReceivers] = useState({});
  const [eventDate, setEventDate] = useState(null);
  const [isEventLocked, setIsEventLocked] = useState(false); // Lock state

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const response = await axios.get("/api/admin/users/adduser");
        const fetchedEventDate = response.data.eventDate;

        if (fetchedEventDate) {
          const eventDateObj = new Date(fetchedEventDate);
          setEventDate(eventDateObj);

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          setIsEventLocked(eventDateObj > today);
        }
      } catch (err) {
        console.error(
          err.response?.data?.error || "Failed to fetch admin details."
        );
      }
    };

    fetchAdminDetails();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/admin/users");
        setUsers(response.data);
        updateUnpairedList(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const updateUnpairedList = (userList) => {
    const unpairedUsers = userList.filter((user) => user.matchedBy === null);
    setUnpaired(unpairedUsers);
  };

  const handleMatchUsers = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("/api/admin/users/matchusers");
      if (response.status === 200) {
        setMessage("Users have been successfully matched!");

        const updatedUsersResponse = await axios.get("/api/admin/users");
        setUsers(updatedUsersResponse.data);
        updateUnpairedList(updatedUsersResponse.data);
      } else {
        setMessage("An error occurred during the matching process.");
      }
    } catch (error) {
      setMessage("An error occurred during the matching process.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectReceiver = async (giverId, receiverId) => {
    if (isEventLocked) return; // Prevent assignment if locked

    try {
      const response = await axios.post("/api/admin/users/selectreceiver", {
        giverId: giverId,
        receiverId: Number(receiverId),
      });

      if (response.status === 200) {
        const receiver = unpaired.find(
          (user) => user.id === Number(receiverId)
        );

        const updatedUsers = users.map((user) =>
          user.id === giverId ? { ...user, matchedSanta: receiver } : user
        );

        const updatedUnpaired = unpaired.filter(
          (user) => user.id !== Number(receiverId)
        );
        setUsers(updatedUsers);
        setUnpaired(updatedUnpaired);
        setMessage("Receiver has been assigned.");
      } else {
        setMessage("An error occurred while assigning the receiver.");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage("Invalid request: Giver and receiver cannot be the same.");
      } else {
        setMessage("An unexpected error occurred.");
      }
    }
  };

  const handleReceiverChange = (giverId, receiverId) => {
    setSelectedReceivers((prevState) => ({
      ...prevState,
      [giverId]: receiverId,
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 pb-20">
      <div className="flex flex-grow justify-center items-center p-6">
        <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-red-600 text-center mb-6">
            Match Santa 🎅
          </h1>

          {message && (
            <p className="text-center text-green-600 font-medium mb-4">
              {message}
            </p>
          )}

          <button
            onClick={handleMatchUsers}
            disabled={loading || isEventLocked}
            className={`w-full flex justify-center items-center gap-2 py-3 font-semibold rounded-lg shadow-md transition focus:outline-none focus:ring-2 ${
              isEventLocked
                ? "bg-gray-400 cursor-not-allowed text-gray-700"
                : "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400"
            }`}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Generate Matches"
            )}
          </button>

          {isEventLocked && (
            <p className="text-center text-red-500 font-medium mt-2">
              Matches cannot be generated before the event date (
              {eventDate ? eventDate.toDateString() : "loading..."}).
            </p>
          )}

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 text-center">
              Matched Results 🎁
            </h2>

            {users.length > 0 ? (
              <ul className="mt-4 space-y-4">
                {users.map((user, index) => (
                  <li
                    key={index}
                    className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-center gap-4"
                  >
                    <span className="font-medium text-gray-900">
                      {user.email || "No giver"}
                    </span>
                    <span className="text-gray-600 text-lg">➡️</span>
                    <span className="font-medium text-gray-900">
                      {user.matchedSanta?.email || "No receiver"}
                    </span>

                    {user.matchedSanta === null && unpaired.length > 0 && (
                      <div className="relative flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <select
                          onChange={(e) =>
                            handleReceiverChange(user.id, e.target.value)
                          }
                          value={selectedReceivers[user.id] || ""}
                          className="bg-white text-black px-3 py-2 border border-gray-400 rounded-lg w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={isEventLocked}
                        >
                          <option value={""} disabled>
                            Select Receiver
                          </option>
                          {unpaired.map((unpairedUser) => (
                            <option
                              key={unpairedUser.id}
                              value={unpairedUser.id}
                            >
                              {unpairedUser.email}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() =>
                            selectedReceivers[user.id] &&
                            handleSelectReceiver(
                              user.id,
                              selectedReceivers[user.id]
                            )
                          }
                          className={`px-4 py-2 rounded-lg shadow-md transition w-full sm:w-auto ${
                            isEventLocked
                              ? "bg-gray-400 cursor-not-allowed text-gray-700"
                              : "bg-green-500 text-white hover:bg-green-600"
                          }`}
                          disabled={isEventLocked}
                        >
                          Assign
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500 mt-4">
                Start matching now to generate Santa pairs!
              </p>
            )}
          </div>
        </div>
      </div>

      <AdminNavbar />
    </div>
  );
}
