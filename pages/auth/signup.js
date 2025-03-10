import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import { jwtDecode } from "jwt-decode"; // Correct import

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [password, setPassword] = useState(""); // New password state
  const [role, setRole] = useState("FRONT_OF_HOUSE"); // Default role selection
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/auth/signup", {
        email: username, // Use email instead of username
        adminCode,
        password, // Pass password to API
        role, // Send selected role to API
      });

      if (response.data && response.data.token) {
        const { token } = response.data;

        // Store token in localStorage
        localStorage.setItem("token", token);
        console.log("Token stored:", token);

        // Decode token
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);

        // Redirect based on role
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

					<div>
						<label className="block text-black font-semibold mb-2">
							Admin Code
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

					{/* Role Selection - Front of House / Back of House */}
					<div className="mt-4">
						<label className="block text-black font-semibold mb-2">
							Select Your Role:
						</label>
						<div className="flex space-x-4 mt-2">
							<button
								type="button"
								className={`w-1/2 p-3 text-center rounded-lg border-2 
								${
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
								className={`w-1/2 p-3 text-center rounded-lg border-2 
								${
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

					{/* Show loading spinner */}
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

				{/* Link to Login */}
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
