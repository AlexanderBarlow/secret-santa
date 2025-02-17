import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [matchedSanta, setMatchedSanta] = useState();
  const [matchedSantaWishlist, setMatchedSantaWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [wishlistInputs, setWishlistInputs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const userResponse = await axios.get("/api/userinfo", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(userResponse.data);
        setMatchedSanta(userResponse.data.matchedSanta);

        const wishlistResponse = await axios.get(
          "/api/admin/users/addwishlist",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (wishlistResponse.data?.wishlist) {
          setWishlist(wishlistResponse.data.wishlist);
          setWishlistInputs(wishlistResponse.data.wishlist);
        }

        setLoading(false);
      } catch (err) {
        setError("There was an error fetching your data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchMatchedSanta = async () => {
      try {
        if (!matchedSanta) return;

        const matchedSantaResponse = await axios.post("/api/assigned", {
          email: matchedSanta.email,
        });

        if (matchedSantaResponse.status === 200) {
          setMatchedSantaWishlist(matchedSantaResponse.data.wishlist.items);
        } else {
          setMatchedSantaWishlist([]);
        }
      } catch (error) {
        setMatchedSantaWishlist([]);
      }
    };

    fetchMatchedSanta();
  }, [matchedSanta]);

  const handleAddToWishlist = async (e) => {
    e.preventDefault();

    const validWishlist = wishlistInputs.filter((item) => item.trim() !== "");

    if (validWishlist.length === 0) {
      setError("Please enter at least one valid wishlist item.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

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
        setWishlist(validWishlist);
        setWishlistInputs(validWishlist);
        setError("");
        setSuccess("Your wishlist has been updated successfully!");
      }
    } catch (err) {
      setError("Failed to add items to wishlist. Please try again.");
    }
  };

  const handleInputChange = (index, value) => {
    const updatedWishlist = [...wishlistInputs];
    updatedWishlist[index] = value;
    setWishlistInputs(updatedWishlist);
  };

  const handleAddWishlistItem = () => {
    setWishlistInputs([...wishlistInputs, ""]);
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      localStorage.removeItem("token");
      router.push("/login");
    } catch (error) {
      setError("Failed to log out. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-red-500 to-red-700 text-white py-6">
      <header className="w-full text-center py-5 shadow-md">
        <h1 className="text-3xl font-bold tracking-wide">
          Secret Santa Dashboard
        </h1>
      </header>

      <main className="w-full max-w-4xl p-6 bg-white text-gray-900 rounded-xl shadow-lg mt-6">
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-md text-center mb-4">
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-600 p-3 rounded-md text-center mb-4">
            <p>{success}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-600 text-lg">Loading...</div>
        ) : (
          <>
            {user && (
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Welcome, {user.email}! 🎄
                </h2>
              </div>
            )}

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

            <div className="mt-12">
              <h3 className="text-xl font-semibold text-gray-800 text-center">
                Matched Santa 🎅
              </h3>
              {matchedSanta ? (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow text-center">
                  <p>
                    <strong>Email:</strong> {matchedSanta.email}
                  </p>
                  <p className="mt-2">
                    <strong>Wishlist:</strong>
                  </p>
                  <ul className="mt-2">
                    {matchedSantaWishlist.length > 0 ? (
                      matchedSantaWishlist.map((item, index) => (
                        <li key={index} className="text-gray-700">
                          {item.item}
                        </li>
                      ))
                    ) : (
                      <p>No wishlist available.</p>
                    )}
                  </ul>
                </div>
              ) : (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow text-center">
                  <p>No match yet. Please check back later.</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <button
        onClick={handleLogout}
        className="fixed bottom-4 right-4 px-6 py-3 bg-red-600 text-white font-semibold rounded-full shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Logout
      </button>
    </div>
  );
}
