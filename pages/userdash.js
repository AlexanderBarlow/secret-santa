import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next"; // Import the useTranslation hook
import LanguageSwitcher from "../components/languageswitcher";

export default function UserDashboard() {
  const { t } = useTranslation(); // Initialize the translation function
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [matchedSanta, setMatchedSanta] = useState();
  const [matchedSantaWishlist, setMatchedSantaWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [wishlistInputs, setWishlistInputs] = useState([]);
  const [eventDetails, setEventDetails] = useState({
    eventDate: "",
    matchSantaDate: "",
    overview: "",
  });
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // Fetch user data
        const userResponse = await axios.get("/api/userinfo", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(userResponse.data);
        setMatchedSanta(userResponse.data.matchedSanta);

        // Fetch wishlist data
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

        // Fetch event details
        const eventResponse = await axios.get("/api/admin/users/adduser"); // Adjusted API endpoint for event details
        setEventDetails(eventResponse.data);

        setLoading(false);
      } catch (err) {
        setError(t("error_fetching_data"));
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

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
      setError(t("error_empty_wishlist"));
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
        setSuccess(t("Wishlist updated successfully"));
      }
    } catch (err) {
      setError(t("Please add items."));
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
      setError(t("error_logging_out"));
    }
  };

  return (
    <>
      <LanguageSwitcher />
      <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-white to-red-700 text-white py-6">
        <header className="w-full text-center py-5 shadow-md">
          <h1 className="text-3xl font-bold tracking-wide text-gray-900">
            {t("Secret Santa Dashboard")}
          </h1>
        </header>

        <main className="w-full max-w-5xl p-8 bg-white text-gray-900 rounded-xl shadow-lg mt-6 mx-auto">
          {error && (
            <div className="bg-red-100 text-red-600 p-4 rounded-md text-center mb-6">
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-100 text-green-600 p-4 rounded-md text-center mb-6">
              <p>{success}</p>
            </div>
          )}

          

          {loading ? (
            <div className="text-center text-gray-600 text-lg">
              {t("loading")}
            </div>
          ) : (
            <>
              {user && (
                  <div className="mb-6 text-center">
                    <div className="flex flex-col items-center">
                    <img
                      src={user.profilePicture || "/default-profile.png"} // Fallback if no profile picture
                      alt="Profile"
                      className="w-24 h-24 rounded-full border-4 border-gray-300 shadow-lg object-cover"
                    />
                  <h2 className="text-3xl font-semibold text-gray-800">
                    {t("welcome")}, {user.email}! 🎄
                  </h2>
                </div>
                </div>
              )}

              {/* Flex Container for Wishlist, Matched Santa, and Event Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Wishlist Section */}
                <div className="p-6 bg-gray-50 rounded-xl shadow-lg flex flex-col items-center">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    {t("Your Wishlist")} 🎁
                  </h3>
                  <form onSubmit={handleAddToWishlist} className="w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {wishlistInputs.map((item, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-200 rounded-lg shadow-sm text-center"
                        >
                          <input
                            type="text"
                            value={item}
                            onChange={(e) =>
                              handleInputChange(index, e.target.value)
                            }
                            placeholder={item || t("item")}
                            className="w-full p-2 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      ))}
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 mt-4 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {t("Save Wishlist")}
                    </button>
                  </form>

                  <button
                    onClick={handleAddWishlistItem}
                    className="mt-4 w-full py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {t("Add Item")}
                  </button>
                </div>

                {/* Matched Santa Section */}
                <div className="p-6 bg-gray-50 rounded-xl shadow-lg flex flex-col items-center">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    {t("Matched Santa")} 🎅
                  </h3>
                  {matchedSanta ? (
                    <div className="text-center">
                      <p>
                        <strong>{t("Name")}:</strong> {matchedSanta.email}
                      </p>
                      <p className="mt-4">
                        <strong>{t("wishlist")}:</strong>
                      </p>
                      <ul className="mt-2">
                        {matchedSantaWishlist.length > 0 ? (
                          matchedSantaWishlist.map((item, index) => (
                            <li key={index} className="text-gray-700">
                              {item.item}
                            </li>
                          ))
                        ) : (
                          <p>{t("No Wishlist Yet!")}</p>
                        )}
                      </ul>
                    </div>
                  ) : (
                    <p>{t("No Match Yet")}</p>
                  )}
                </div>

                {/* Event Details Section */}
                <div className="p-6 bg-gray-50 rounded-xl shadow-lg flex flex-col items-center">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    {t("Event Details")} 🎄
                  </h3>
                  <div className="text-center">
                    <p>
                      <strong>{t("Event Date")}:</strong>{" "}
                      {new Date(eventDetails.eventDate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>{t("Match Date")}:</strong>{" "}
                      {new Date(
                        eventDetails.matchSantaDate
                      ).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>{t("Overview")}:</strong> {eventDetails.overview}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>

        <button
          onClick={handleLogout}
          className="fixed bottom-4 right-4 px-6 py-3 bg-white text-red-500 font-semibold rounded-full shadow-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          {t("logout")}
        </button>
      </div>
    </>
  );
}
