import fs from "node:fs/promises";

export async function createOrganization(name: string, product: string) {
	const organizations = await import("../data/organizations.json", {
		with: { type: "json" },
	}).then((mod) => mod.default);

	const newId =
		organizations.length > 0
			? organizations[organizations.length - 1].id + 1
			: 1;

	organizations.push({
		id: newId,
		name,
		product,
	});

	await fs.writeFile(
		"./src/data/organizations.json",
		JSON.stringify(organizations, null, 2),
	);

	return newId; // Return the new organization's ID
}
