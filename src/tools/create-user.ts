import fs from "node:fs/promises";

export async function createUser(
	role: string,
	email: string,
	organizationId: number,
) {
	// check if organizationId exists
	const organizations = await import("../data/organizations.json", {
		with: { type: "json" },
	}).then((mod) => mod.default);

	if (!organizations.some((org) => org.id === organizationId)) {
		throw new Error("Organization ID does not exist");
	}

	const users = await import("../data/users.json", {
		with: { type: "json" },
	}).then((mod) => mod.default);

	const newId = users.length > 0 ? users[users.length - 1].id + 1 : 1;

	users.push({
		id: newId,
		role,
		email,
		organizationId,
	});

	await fs.writeFile("./src/data/users.json", JSON.stringify(users, null, 2));

	return newId; // Return the new user's ID
}
