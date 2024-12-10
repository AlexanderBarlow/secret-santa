import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faUsers,
	faPlus,
	faGift,
	faList,
	faCog,
} from "@fortawesome/free-solid-svg-icons";

export default function Navbar({ userType }) {
	const router = useRouter();

	// Define links for admin and user
	const links =
		userType === "admin"
			? [
					{ href: "/admin/users", label: "Users", icon: faUsers },
					{ href: "/admin/add-user", label: "Add User", icon: faPlus },
					{ href: "/admin/match-santa", label: "Match Santa", icon: faGift },
			  ]
			: [
					{ href: "/wishlist", label: "Wishlist", icon: faList },
					{ href: "/assigned", label: "Assigned", icon: faGift },
					{ href: "/settings", label: "Settings", icon: faCog },
			  ];

	return (
		<nav className="fixed bottom-0 w-full bg-white border-t shadow-lg">
			<div className="flex justify-around items-center py-2">
				{links.map((link) => (
					<Link key={link.href} href={link.href}>
						<div
							className={`flex flex-col items-center ${
								router.pathname === link.href ? "text-blue-500" : "text-black"
							}`}
						>
							<FontAwesomeIcon icon={link.icon} size="lg" />
							<span className="text-sm">{link.label}</span>
						</div>
					</Link>
				))}
			</div>
		</nav>
	);
}
