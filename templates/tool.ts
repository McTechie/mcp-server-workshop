// @ts-nocheck

mcpServer.registerTool(
	"KEY", // キー
	{
		title: "TITLE", // タイトル
		description: "DESCRIPTION", // 説明
		inputSchema: {
			arg1: z.string(),
			arg2: z.number(),
		},
		annotations: {
			title: "TITLE", // タイトル
			readOnlyHint: false, // この機能は情報の読み取りのみを行いますか?
			destructiveHint: false, // この機能はデータを削除しますか?
			idempotentHint: false, // この機能は何度実行しても同じ結果になりますか?
			openWorldHint: false, // この機能は外部のデータを参照しますか?
		},
	},
	async (params: { arg1: string; arg2: number }) => {
		// ツールの実行結果
		return {
			content: [{ type: "text", text: "MESSAGE" }],
		};
	},
);
