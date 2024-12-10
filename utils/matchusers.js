export function matchUsers(users) {
	// Check if we have enough users
	if (users.length < 2) {
		throw new Error("There must be at least two users to make a match.");
	}

	// Shuffle the users array to randomize the order
	const shuffledUsers = shuffleArray([...users]);

	// Create an array to store the matches
	let matches = [];

	// Loop through the users and create pairs
	for (let i = 0; i < shuffledUsers.length; i++) {
		const giver = shuffledUsers[i];
		const receiver = shuffledUsers[(i + 1) % shuffledUsers.length]; // Wrap around to the first user for the last user
		if (giver.id !== receiver.id) {
			// Ensure no self-matching
			matches.push({ giver: giver.name, receiver: receiver.name });
		}
	}

	return matches;
}

// Helper function to shuffle an array randomly
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]]; // Swap elements
	}
	return array;
}
