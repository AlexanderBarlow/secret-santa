import jwt from "jsonwebtoken"; // For generating JWT token
import prisma from "../../../lib/prisma";

// List of goofy Christmas-themed profile pictures (NO PEOPLE)
const christmasProfileImages = [
  "/cow1.jpg", // 🎄 Christmas tree with funny face
  "/cow2.jpg", // 🦌 Goofy reindeer with huge nose
  "/cow3.jpg", // 🎅 Santa hat on a snowman with big eyes
];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, adminCode, password, role, profilePicture } = req.body;

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

  // Step 4: Validate the selected profile picture
  if (!christmasProfileImages.includes(profilePicture)) {
    return res
      .status(400)
      .json({ error: "Invalid profile picture selection." });
  }

  try {
    // Step 5: Create the new user in the database with the selected profile picture
    const newUser = await prisma.user.create({
      data: {
        email,
        password, // Store the password as it is (not recommended for production)
        updatedPassword: false, // Assuming the user will change the password after signup
        role, // Store the user's role
        profilePicture, // ✅ Store the chosen profile picture
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
    return res.status(200).json({
      message: "User created successfully!",
      token,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res
      .status(500)
      .json({ error: "Server error. Please try again later." });
  }
}
