import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift, faList, faCog } from "@fortawesome/free-solid-svg-icons";

export default function UserNavbar() {
	const router = useRouter();

	return (
		<nav className="fixed bottom-0 w-full bg-white border-t shadow-lg">
			<div className="flex justify-around items-center py-2">
				<Link href="/wishlist">
					<div
						className={`flex flex-col items-center ${
							router.pathname === "/wishlist" ? "text-blue-500" : "text-black"
						}`}
					>
						<FontAwesomeIcon icon={faList} size="lg" />
						<span className="text-sm">Wishlist</span>
					</div>
				</Link>
				<Link href="/assigned">
					<div
						className={`flex flex-col items-center ${
							router.pathname === "/assigned" ? "text-blue-500" : "text-black"
						}`}
					>
						<FontAwesomeIcon icon={faGift} size="lg" />
						<span className="text-sm">Assigned</span>
					</div>
				</Link>
				<Link href="/settings">
					<div
						className={`flex flex-col items-center ${
							router.pathname === "/settings" ? "text-blue-500" : "text-black"
						}`}
					>
						<FontAwesomeIcon icon={faCog} size="lg" />
						<span className="text-sm">Settings</span>
					</div>
				</Link>
			</div>
		</nav>
	);
}
