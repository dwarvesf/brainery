<%*
const dv = this.app.plugins.plugins["dataview"].api;
const indexPage = dv.pages(`"memo/_index.md"`);

for (const element of indexPage) {
	let content = "---\n";
	for (const prop in element.file.frontmatter) {
		const value = element.file.frontmatter[prop]
		if (Array.isArray(value) && value.length > 0) {
			content += `${prop}: \n  - ${value.join("\n  - ")}\n`;
		} else {
			content += `${prop}: ${value}\n`;
		}
	}
	content += "---\n";

	const indexArticles = await dv.queryMarkdown(`
		LIST WITHOUT ID "[[" + file.path + "|" + title + "]]"
		FROM "memo" AND !"memo/index"
		WHERE title != NULL
		SORT title
	`);
	content += `## Dwarves Memo \n\n${indexArticles.value}`;

	// get folder and file path
	const filePath = app.vault.getAbstractFileByPath(element.file.path);
	const folder = app.vault.getAbstractFileByPath(element.file.folder)

	// delete the file
	await app.vault.trash(filePath, true);

	// create a new file with the matching template
	await tp.file.create_new(content, element.file.name, false, folder);
}
%>