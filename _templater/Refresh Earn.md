<%*
const dv = this.app.plugins.plugins["dataview"].api;
const earnPage = dv.pages(`"earn/_index.md"`);

for (const element of earnPage) {
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

	const earnArticles = await dv.queryMarkdown(`
		TABLE WITHOUT ID
			"[[" + file.path + "|" + title + "]]" as title,
			bounty + " ICY" as bounty,
			status
		FROM "earn" AND !"earn/_index"
		WHERE title != NULL
		SORT status DESC
	`);
	content += `## Dwarves Community Bounty\n\n`;
	content += `Dwarves bounty program is the way for both peeps and community can contribute to our day to day activities, including building internal tools, new tech r&d or knowledge sharing.\n\n`;
	content += `**→ Apply for research team:** open ticket in [our Discord](https://discord.com/invite/dwarvesv)\n`
	content += `**→ To contribute**: open ticket in [our Discord](https://discord.com/invite/dwarvesv) and give @hnh a ping\n\n`
	content += earnArticles.value;

	// get folder and file path
	const filePath = app.vault.getAbstractFileByPath(element.file.path);
	const folder = app.vault.getAbstractFileByPath(element.file.folder);

	// delete the file
	await app.vault.trash(filePath, true);

	// create a new file with the matching template
	await tp.file.create_new(content, element.file.name, false, folder);
}
%>