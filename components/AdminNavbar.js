import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faUsers,
	faPlus,
	faGift,
	faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { parseCookies, destroyCookie } from "nookies"; // Import nookies to manage cookies

export default function AdminNavbar() {
	const router = useRouter();

	// Define the navigation items
	const navItems = [
		{
			href: "/admin/dashboard",
			icon: faUsers,
			label: "Users",
		},
		{
			href: "/admin/adduser",
			icon: faPlus,
			label: "Join Code",
		},
		{
			href: "/admin/matchsanta",
			icon: faGift,
			label: "Match Santa",
		},
	];

	// Handle logout
	const handleLogout = async () => {
		console.log("function");
		try {
			// Send a POST request to the logout API to clear the JWT cookie
			const response = await fetch("/api/auth/logout", {
				method: "POST", // POST method for logout
			});

			console.log(response);

			if (response.ok) {
				// Redirect user to the sign-in page after successful logout
				localStorage.removeItem("token");
				router.push("/auth/signin");
			} else {
				console.error("Logout failed");
			}
		} catch (error) {
			console.error("Error logging out:", error);
		}
	};

	return (
		<nav className="fixed bottom-4 left-0 right-0 mx-auto bg-white border-t shadow-lg rounded-full p-4 max-w-md w-full">
			<div className="flex justify-around items-center">
				{/* Render the navigation items */}
				{navItems.map((item) => (
					<Link href={item.href} key={item.href}>
						<div
							className={`flex flex-col items-center ${
								router.pathname === item.href ? "text-blue-500" : "text-black"
							}`}
						>
							<FontAwesomeIcon icon={item.icon} size="lg" />
							<span className="text-sm">{item.label}</span>
						</div>
					</Link>
				))}

				{/* Logout button */}
				<div
					className="flex flex-col items-center cursor-pointer text-black"
					onClick={handleLogout}
				>
					<FontAwesomeIcon icon={faSignOutAlt} size="lg" />
					<span className="text-sm">Logout</span>
				</div>
			</div>
		</nav>
	);
}
