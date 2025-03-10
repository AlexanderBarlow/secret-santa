export default function UserCard({ user, handleAcceptUser, openDeleteModal }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-300 hover:shadow-xl transition-shadow flex flex-col justify-between min-h-[280px]">
      <h3 className="text-lg font-semibold text-black mb-3 truncate">
        {user.email}
      </h3>

      {/* Role Badge (Color-Coded) */}
      <p
        className={`text-sm font-semibold p-2 rounded text-center ${
          user.role === "FRONT_OF_HOUSE"
            ? "bg-red-200 text-red-800"
            : "bg-blue-200 text-blue-800"
        }`}
      >
        {user.role === "FRONT_OF_HOUSE" ? "Front of House" : "Back of House"}
      </p>

      <h4 className="text-sm text-gray-600 font-semibold mt-2">
        Matched Santa:
      </h4>
      <p className="text-black text-sm">{user.matchedSanta?.email || "N/A"}</p>

      <h4 className="text-sm text-gray-600 font-semibold mt-2">Wishlist:</h4>
      <ul className="list-disc pl-5 text-black text-sm">
        {user.wishlist?.items?.length > 0 ? (
          user.wishlist.items.map((item, index) => (
            <li key={index}>{item.item}</li>
          ))
        ) : (
          <li>No items in wishlist.</li>
        )}
      </ul>

      <h4 className="text-sm text-gray-600 font-semibold mt-2">
        Accepted Status:
      </h4>
      <p
        className={`text-sm font-semibold p-2 rounded mt-1 text-center ${
          user.Accepted
            ? "bg-green-200 text-green-800"
            : "bg-yellow-200 text-yellow-800"
        }`}
      >
        {user.Accepted ? "Accepted" : "Pending"}
      </p>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4">
        {!user.Accepted && (
          <button
            onClick={() => handleAcceptUser(user.id)} // ✅ Now properly updates state
            className="p-3 w-1/2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors"
          >
            Accept
          </button>
        )}
        <button
          onClick={() => openDeleteModal(user.id)}
          className={`p-3 ${
            user.Accepted ? "w-full" : "w-1/2"
          } bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors`}
        >
          Remove
        </button>
      </div>
    </div>
  );
}
