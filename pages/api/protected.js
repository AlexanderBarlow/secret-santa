// import jwt from "jsonwebtoken";

// export default async function handler(req, res) {
// 	const { token } = req.cookies;

// 	if (!token) {
// 		return res.status(401).json({ error: "Not authenticated" });
// 	}

// 	try {
// 		const decoded = jwt.verify(token, process.env.JWT_SECRET);
// 		// Token is valid, proceed with the protected logic
// 		res.status(200).json({ message: "Protected content", user: decoded });
// 	} catch (error) {
// 		res.status(401).json({ error: "Invalid token" });
// 	}
// }
