import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]); // To store the user's current wishlist
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // Success message for adding items
  const [wishlistInputs, setWishlistInputs] = useState([]); // To handle wishlist input fields
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // Fetch user info and wishlist
        const userResponse = await axios.get("/api/userinfo", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(userResponse.data);
        const wishlistResponse = await axios.get(
          "/api/admin/users/addwishlist",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Set the current user's wishlist if available
        if (wishlistResponse.data?.wishlist) {
          setWishlist(wishlistResponse.data.wishlist);
          setWishlistInputs(wishlistResponse.data.wishlist);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("There was an error fetching your data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToWishlist = async (e) => {
    e.preventDefault();

    // Filter out empty wishlist items
    const validWishlist = wishlistInputs.filter((item) => item.trim() !== "");

    if (validWishlist.length === 0) {
      setError("Please enter at least one valid wishlist item.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // Make the POST request to update the wishlist
      const response = await axios.post(
        "/api/admin/users/addwishlist",
        { wishlist: validWishlist },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Update wishlist and input fields with the new data
        setWishlist(validWishlist);
        setWishlistInputs(validWishlist);
        setError(""); // Clear error
        setSuccess("Your wishlist has been updated successfully!"); // Success message
      }
    } catch (err) {
      console.error("Error adding items to wishlist:", err);
      setError("Failed to add items to wishlist. Please try again.");
    }
  };

  const handleInputChange = (index, value) => {
    const updatedWishlist = [...wishlistInputs];
    updatedWishlist[index] = value;
    setWishlistInputs(updatedWishlist);
  };

  const handleAddWishlistItem = () => {
    setWishlistInputs([...wishlistInputs, ""]); // Add a new empty field to the inputs
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      localStorage.removeItem("token");
      router.push("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout failed:", error);
      setError("Failed to log out. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-red-500 to-red-700 text-white py-6">
      {/* Header */}
      <header className="w-full text-center py-5 shadow-md">
        <h1 className="text-3xl font-bold tracking-wide">
          Secret Santa Dashboard
        </h1>
      </header>

      <main className="w-full max-w-4xl p-6 bg-white text-gray-900 rounded-xl shadow-lg mt-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-md text-center mb-4">
            <p>{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-100 text-green-600 p-3 rounded-md text-center mb-4">
            <p>{success}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center text-gray-600 text-lg">Loading...</div>
        ) : (
          <>
            {/* User Info */}
            {user && (
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Welcome, {user.name}! 🎄
                </h2>
                <p className="text-gray-600 mt-1">Email: {user.email}</p>
              </div>
            )}

            {/* User Wishlist */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800 text-center">
                Your Wishlist 🎁
              </h3>
              <form onSubmit={handleAddToWishlist}>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlistInputs.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-100 rounded-lg shadow text-center"
                    >
                      <input
                        type="text"
                        value={item}
                        onChange={(e) =>
                          handleInputChange(index, e.target.value)
                        }
                        placeholder={item || "Enter an item"}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="submit"
                  className="w-full py-2 mt-4 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Update Wishlist
                </button>
              </form>

              {/* Add New Item Button */}
              <button
                onClick={handleAddWishlistItem}
                className="mt-4 w-full py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Add Another Item to Wishlist
              </button>

              {wishlistInputs.length === 0 && (
                <p className="text-center text-gray-500 mt-2">
                  Your wishlist is empty! Here are some ideas.
                </p>
              )}
            </div>
          </>
        )}
      </main>

      {/* Floating Logout Button */}
      <button
        onClick={handleLogout}
        className="fixed bottom-4 right-4 px-6 py-3 bg-red-600 text-white font-semibold rounded-full shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Logout
      </button>
    </div>
  );
}
