import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createOrganization } from "./tools/create-organization";
import { Products, Roles } from "./common";
import { createUser } from "./tools/create-user";

const mcpServer = new McpServer({
	name: "zb-mcp-server",
	version: "0.1.0",
	title: "Zeroboard MCP Server",
	capabilities: {
		resources: {},
		tools: {},
	},
});

mcpServer.registerResource(
	"organizations",
	"zb://organizations/all",
	{
		title: "Organizations",
		description: "List of all organizations in the Database",
		mimeType: "application/json",
	},
	async (uri) => {
		const organizations = await import("./data/organizations.json", {
			with: { type: "json" },
		}).then((mod) => mod.default);

		return {
			contents: [
				{
					uri: uri.href,
					text: JSON.stringify(organizations, null, 2),
					mimeType: "application/json",
				},
			],
		};
	},
);

mcpServer.registerResource(
	"users",
	"zb://users/all",
	{
		title: "Users",
		description: "List of all users in the Database",
		mimeType: "application/json",
	},
	async (uri) => {
		const users = await import("./data/users.json", {
			with: { type: "json" },
		}).then((mod) => mod.default);

		return {
			contents: [
				{
					uri: uri.href,
					text: JSON.stringify(users, null, 2),
					mimeType: "application/json",
				},
			],
		};
	},
);

mcpServer.registerTool(
	"create-organization",
	{
		title: "Create Organization",
		description: "Create a new organization in the Database",
		inputSchema: {
			name: z.string().min(1, "Organization name is required"),
			product: z
				.string()
				.refine(
					(value) => Object.values(Products).includes(value as Products),
					"Invalid product selected",
				),
		},
		annotations: {
			title: "Create Organization",
			readOnlyHint: false,
			destructiveHint: false,
			idempotentHint: false,
			openWorldHint: true,
		},
	},
	async ({ name, product }) => {
		try {
			const id = await createOrganization(name, product);

			return {
				content: [
					{ type: "text", text: `Organization created with ID: ${id}` },
				],
			};
		} catch (error) {
			return {
				isError: true,
				content: [{ type: "text", text: "Failed to create organization." }],
			};
		}
	},
);

mcpServer.registerTool(
	"create-user",
	{
		title: "Create User",
		description: "Create a new user in the Database",
		inputSchema: {
			role: z
				.string()
				.refine(
					(value) => Object.values(Roles).includes(value as Roles),
					"Invalid role selected",
				),
			email: z.string().email("Invalid email address"),
			organizationId: z.number().int().positive("Invalid organization ID"),
		},
		annotations: {
			title: "Create User",
			readOnlyHint: false,
			destructiveHint: false,
			idempotentHint: false,
			openWorldHint: true,
		},
	},
	async ({ role, email, organizationId }) => {
		try {
			const id = await createUser(role, email, organizationId);

			return {
				content: [{ type: "text", text: `User created with ID: ${id}` }],
			};
		} catch (error) {
			return {
				isError: true,
				content: [{ type: "text", text: "Failed to create user." }],
			};
		}
	},
);

// Transport Protocols: stdio and http streaming
// 1. stdio is great if the application and server are running in the same place
// 2. http streaming is great if the application and server are running in different places

async function main() {
	const transport = new StdioServerTransport();
	await mcpServer.connect(transport);
}

main();
