// @ts-nocheck

mcpServer.registerResource(
	"key", // キー
	"URI", // URI
	{
		title: "TITLE", // タイトル
		description: "DESCRIPTION", // 説明
		mimeType: "application/json", // MIMEタイプ
	},
	async (uri) => {
		// リソースの内容を取得するロジック

		return {
			contents: [
				{
					uri: uri.href,
					text: JSON.stringify({ key: "value" }, null, 2), // ここで実際のデータを返す
					mimeType: "application/json", // MIMEタイプ
				},
			],
		};
	},
);
