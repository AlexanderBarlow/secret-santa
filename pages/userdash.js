import { useState, useEffect } from "react";
import axios from "axios";

export default function UserDashboard() {
  const [user, setUser] = useState(null); // Holds user data
  const [assignedPerson, setAssignedPerson] = useState(null); // Matched Secret Santa
  const [wishlist, setWishlist] = useState([]); // Wishlist items

  useEffect(() => {
    // Fetch user info and assigned Secret Santa data
    const fetchData = async () => {
      try {
        const userResponse = await axios.get("/api/user"); // Replace with actual endpoint
        const assignedResponse = await axios.get("/api/user/assigned"); // Replace with actual endpoint

        setUser(userResponse.data);
        setAssignedPerson(assignedResponse.data.assigned);
        setWishlist(assignedResponse.data.wishlist);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-6">
      {/* Header */}
      <header className="w-full bg-red-500 text-white py-4 shadow-md">
        <h1 className="text-center text-2xl font-bold">
          Secret Santa Dashboard
        </h1>
      </header>

      <main className="w-full max-w-4xl p-4 bg-white rounded-lg shadow-lg mt-6">
        {/* User Info */}
        {user && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Welcome, {user.name}!
            </h2>
            <p className="text-gray-600">Email: {user.email}</p>
          </div>
        )}

        {/* Assigned Person */}
        {assignedPerson ? (
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Your Secret Santa Assignment:
            </h3>
            <p className="text-gray-600">
              You are buying for{" "}
              <span className="font-bold">{assignedPerson.name}</span>.
            </p>
            <h4 className="text-lg font-semibold mt-4">Their Wishlist:</h4>
            <ul className="list-disc pl-6 mt-2">
              {wishlist.length > 0 ? (
                wishlist.map((item, index) => (
                  <li key={index} className="text-gray-700">
                    {item}
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No wishlist items available.</li>
              )}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500">
            Your assignment will be available soon.
          </p>
        )}

        {/* User Wishlist */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            Your Wishlist:
          </h3>
          <ul className="list-disc pl-6 mt-2">
            {user && user.wishlist.length > 0 ? (
              user.wishlist.map((item, index) => (
                <li key={index} className="text-gray-700">
                  {item}
                </li>
              ))
            ) : (
              <li className="text-gray-500">No items in your wishlist.</li>
            )}
          </ul>
        </div>
      </main>
    </div>
  );
}
