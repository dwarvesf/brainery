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
		FROM "earn" and !"_templates" and !"_templater" and !"_index" and !"site-index" and !"README"
		WHERE status = "Open"
			AND title != NULL
		SORT status DESC
	`);
	content += `## Earn and Bounty Program\n\n`;
	content += `Our earn and bounty program for all of the open-source work we do at Console Labs. A good portion of the earns and bounties help to improve quality-of-life for our community, creating bots and extensions for our messaging apps, and more serious work such as aggregating data from blockchains.\n\n`;
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