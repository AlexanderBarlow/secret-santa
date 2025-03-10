import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faUsers,
	faPlus,
	faGift,
	faSignOutAlt,
	faChartSimple,
} from "@fortawesome/free-solid-svg-icons";

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
			label: "Event Details",
		},
		{
			href: "/admin/matchsanta",
			icon: faGift,
			label: "Match Santa",
		},
		{
			href: "/admin/analytics",
			icon: faChartSimple,
			label: "Analytics",
		},
	];

	// Handle logout
	const handleLogout = async () => {
		try {
			const response = await fetch("/api/auth/logout", {
				method: "POST",
			});

			if (response.ok) {
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
		<nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg rounded-full p-4">
			<div className="flex justify-around items-center">
				{/* Render navigation items */}
				{navItems.map((item) => (
					<Link href={item.href} key={item.href}>
						<div
							className={`flex flex-col items-center transition-all duration-300 ${
								router.pathname === item.href
									? "text-red-500 scale-110"
									: "text-gray-700 hover:text-red-500 hover:scale-105"
							}`}
						>
							<FontAwesomeIcon icon={item.icon} size="lg" />
							<span className="text-xs font-medium">{item.label}</span>
						</div>
					</Link>
				))}

				{/* Logout button */}
				<div
					className="flex flex-col items-center cursor-pointer text-gray-700 hover:text-red-500 hover:scale-105 transition-all duration-300"
					onClick={handleLogout}
				>
					<FontAwesomeIcon icon={faSignOutAlt} size="lg" />
					<span className="text-xs font-medium">Logout</span>
				</div>
			</div>
		</nav>
	);
}
