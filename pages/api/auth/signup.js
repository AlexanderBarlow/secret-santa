import { parseCookies } from "nookies";
import jwt from "jsonwebtoken"; // For generating JWT token
import prisma from "../../../lib/prisma";

// List of goofy Christmas-themed profile pictures (NO PEOPLE)
const christmasProfileImages = [
	"https://i.imgur.com/tlVzMCI.png", // 🎄 Christmas tree with funny face
	"https://i.imgur.com/KsbTydP.png", // 🦌 Goofy reindeer with huge nose
	"https://i.imgur.com/DgH2mLP.png", // 🎅 Santa hat on a snowman with big eyes
	"https://i.imgur.com/7YUpMCC.png", // 🦌 Reindeer wearing Christmas lights
	"https://i.imgur.com/ZT65hDd.png", // 🎁 Funny Christmas gift box with eyes
	"https://i.imgur.com/3eHQQyH.png", // ❄️ Snowflake with a mustache
	"https://i.imgur.com/qvI3SeT.png", // 🧦 Goofy Christmas stocking with candy canes
	"https://i.imgur.com/COj0Sm5.png", // 🔔 Silly jingle bell with a smile
	"https://i.imgur.com/nQoM41O.png", // 🎄 Goofy pine tree wearing a Santa hat
	"https://i.imgur.com/Wpe9F4Y.png", // 🍪 Funny Christmas cookie with sunglasses
];

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	const { email, adminCode, password, role } = req.body;

	// Step 1: Validate the provided adminCode
	const storedAdminCode = await prisma.adminCode.findUnique({
		where: { code: adminCode },
	});

	if (!storedAdminCode) {
		return res.status(400).json({ error: "Invalid admin code." });
	}

	// Step 2: Check if the email already exists
	const existingUser = await prisma.user.findUnique({
		where: { email },
	});

	if (existingUser) {
		return res.status(400).json({ error: "Email already registered." });
	}

	// Step 3: Ensure the role is either FRONT_OF_HOUSE or BACK_OF_HOUSE
	if (role !== "FRONT_OF_HOUSE" && role !== "BACK_OF_HOUSE") {
		return res.status(400).json({ error: "Invalid role selection." });
	}

	try {
		// ✅ Select a random goofy Christmas avatar
		const randomProfilePicture =
			christmasProfileImages[
				Math.floor(Math.random() * christmasProfileImages.length)
			];

		// Step 4: Create the new user in the database with a profile picture
		const newUser = await prisma.user.create({
			data: {
				email,
				password, // Store the password as it is (not recommended for production)
				updatedPassword: false, // Assuming the user will change the password after signup
				role, // Store the user's role
				profilePicture: randomProfilePicture, // ✅ Assign a goofy Christmas avatar
			},
		});

		// Generate a JWT token for the user
		const token = jwt.sign(
			{
				id: newUser.id,
				email: newUser.email,
				isAdmin: newUser.isAdmin,
				changedPassword: newUser.changedPassword,
				role: newUser.role,
				profilePicture: newUser.profilePicture, // ✅ Include profile picture in token
			},
			process.env.JWT_SECRET,
			{ expiresIn: "1d" }
		);

		// Send success response with the token
		return res
			.status(200)
			.json({ message: "User created successfully!", token });
	} catch (error) {
		console.error("Error creating user:", error);
		return res
			.status(500)
			.json({ error: "Server error. Please try again later." });
	}
}
