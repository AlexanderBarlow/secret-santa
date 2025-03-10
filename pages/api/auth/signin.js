import prisma from "../../../lib/prisma"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;
    console.log(email, password);

    try {
      // Find user by email
      const user = await prisma.user.findUnique({ where: { email } });

			if (!user) {
				return res.status(401).json({ error: "Invalid email or password" });
			}

			const isValidPassword = await bcrypt.compare(password, user.password) || password === user.password;

      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Create JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, isAdmin: user.isAdmin, changedPassword: user.changedPassword},
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
