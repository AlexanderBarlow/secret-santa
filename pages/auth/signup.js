import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import { jwtDecode } from "jwt-decode"; // Correct import

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("FRONT_OF_HOUSE");
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // List of available profile pictures
  const profileImages = ["/cow1.jpg", "/cow2.jpg", "/cow3.jpg"];

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!selectedProfile) {
      setError("Please select a profile picture.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/auth/signup", {
        email: username,
        adminCode,
        password,
        role,
        profilePicture: selectedProfile, // Send selected profile picture
      });

      if (response.data && response.data.token) {
        const { token } = response.data;
        localStorage.setItem("token", token);
        const decodedToken = jwtDecode(token);

        if (decodedToken.isAdmin) {
          router.push("/admin/dashboard");
        } else {
          router.push("/userdash");
        }
      } else {
        setError("Invalid email or password.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-[100dvh] bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center mb-6 text-black">
          Sign Up
        </h1>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Profile Picture Selection */}
        <div className="mb-4">
          <h2 className="text-black font-semibold mb-2 text-center">
            Choose Your Profile Picture
          </h2>
          <div className="flex justify-center space-x-4">
            {profileImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedProfile(img)}
                className={`p-1 border-2 rounded-lg transition ${
                  selectedProfile === img
                    ? "border-blue-500 shadow-lg"
                    : "border-gray-300"
                }`}
              >
                <img
                  src={img}
                  alt="Profile"
                  className="w-16 h-16 rounded-lg object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <label className="block text-black font-semibold mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-black font-semibold mb-2 flex items-center">
              Event Code
              {/* Info Icon */}
              <div className="relative group ml-2">
                <div className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-300 text-black text-xs font-bold cursor-pointer">
                  i
                </div>
                {/* Tooltip */}
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 p-2 bg-gray-700 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  The event code is provided by the event organizer.
                </div>
              </div>
            </label>

            <input
              type="text"
              placeholder="Enter the admin code"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>

          <div>
            <label className="block text-black font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>

          {/* Role Selection */}
          <div className="mt-4">
            <label className="block text-black font-semibold mb-2">
              Select Your Role:
            </label>
            <div className="flex space-x-4 mt-2">
              <button
                type="button"
                className={`w-1/2 p-3 text-center rounded-lg border-2 ${
                  role === "FRONT_OF_HOUSE"
                    ? "border-red-500 bg-red-100 text-red-700"
                    : "border-gray-300 bg-white text-gray-700"
                }`}
                onClick={() => setRole("FRONT_OF_HOUSE")}
              >
                Front of House
              </button>
              <button
                type="button"
                className={`w-1/2 p-3 text-center rounded-lg border-2 ${
                  role === "BACK_OF_HOUSE"
                    ? "border-blue-500 bg-blue-100 text-blue-700"
                    : "border-gray-300 bg-white text-gray-700"
                }`}
                onClick={() => setRole("BACK_OF_HOUSE")}
              >
                Back of House
              </button>
            </div>
          </div>

          {loading && (
            <p className="text-center text-black">Creating account...</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Create Account
          </button>
        </form>

        <p className="text-center mt-4 text-black">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-blue-500 hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}
