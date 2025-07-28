import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const mcpServer = new McpServer({
	name: "zb-mcp-server",
	version: "0.1.0",
	title: "Zeroboard MCP Server",
	capabilities: {
		resources: {},
		tools: {},
	},
});

// Transport Protocols: stdio and http streaming
// 1. stdio is great if the application and server are running in the same place
// 2. http streaming is great if the application and server are running in different places

async function main() {
	const transport = new StdioServerTransport();
	await mcpServer.connect(transport);
}

main();
