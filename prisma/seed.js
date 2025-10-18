const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
	const hashedPassword = "adminpassword"; // Replace with a secure password
	await prisma.user.create({
		data: {
			email: "admin@example.com",
			password: hashedPassword,
			isAdmin: true,
			profilePicture: "cow1.jpg"
		},
	});

	console.log("Admin account created");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
