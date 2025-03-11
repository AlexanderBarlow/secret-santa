import { useState } from "react";

export default function ({ user, handleAcceptUser, openDeleteModal }) {
	const [wishlistOpen, setWishlistOpen] = useState(false);

	return (
		<div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow flex flex-col justify-between min-h-[350px]">
			{/* Profile Picture & Name */}
			<div className="flex flex-col items-center mb-3">
				<img
					src={user.profilePicture || "/default-profile.png"}
					alt="Profile"
					className="w-20 h-20 rounded-full border-2 border-gray-300 shadow-md object-cover"
				/>
				<h3 className="text-lg font-semibold text-black mt-2 truncate text-center">
					{user.email}
				</h3>
			</div>

			{/* Role Badge */}
			<p
				className={`text-sm font-semibold p-2 rounded-full text-center w-fit mx-auto ${
					user.role === "FRONT_OF_HOUSE"
						? "bg-red-200 text-red-800"
						: "bg-blue-200 text-blue-800"
				}`}
			>
				{user.role === "FRONT_OF_HOUSE" ? "Front of House" : "Back of House"}
			</p>

			{/* Matched Santa */}
			<div className="mt-3 text-center">
				<h4 className="text-sm text-gray-600 font-semibold">Matched Santa:</h4>
				<p className="text-black text-sm">
					{user.matchedSanta?.email || "N/A"}
				</p>
			</div>

			{/* Wishlist (Dropdown) */}
			<div className="mt-3">
				<h4
					className="text-sm text-gray-600 font-semibold cursor-pointer flex justify-between items-center"
					onClick={() => setWishlistOpen(!wishlistOpen)}
				>
					Wishlist:
					<span className="text-blue-500 text-xs">
						{wishlistOpen ? "▲ Hide" : "▼ Show"}
					</span>
				</h4>
				{wishlistOpen && (
					<ul className="mt-2 bg-gray-100 p-2 rounded-lg text-black text-sm">
						{user.wishlist?.items?.length > 0 ? (
							user.wishlist.items.map((item, index) => (
								<li key={index} className="p-1 border-b last:border-none">
									{item.item}
								</li>
							))
						) : (
							<li className="text-gray-500">No items in wishlist.</li>
						)}
					</ul>
				)}
			</div>

			{/* Accepted Status */}
			<div className="mt-3 text-center">
				<h4 className="text-sm text-gray-600 font-semibold">
					Accepted Status:
				</h4>
				<p
					className={`text-sm font-semibold p-2 rounded-full mt-1 w-fit mx-auto ${
						user.Accepted
							? "bg-green-200 text-green-800"
							: "bg-yellow-200 text-yellow-800"
					}`}
				>
					{user.Accepted ? "Accepted" : "Pending"}
				</p>
			</div>

			{/* Action Buttons */}
			<div className="flex gap-2 mt-5">
				{!user.Accepted && (
					<button
						onClick={() => handleAcceptUser(user.id)}
						className="p-3 w-1/2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
					>
						Accept
					</button>
				)}
				<button
					onClick={() => openDeleteModal(user.id)}
					className={`p-3 ${
						user.Accepted ? "w-full" : "w-1/2"
					} bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition`}
				>
					Remove
				</button>
			</div>
		</div>
	);
}
