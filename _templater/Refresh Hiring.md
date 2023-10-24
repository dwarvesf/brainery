<%*
const dv = this.app.plugins.plugins["dataview"].api;
const hiringPage = dv.pages(`"hiring/_index.md"`);
const readme = dv.pages(`"hiring/README.md"`);
const readmeFile = await app.vault.getAbstractFileByPath(readme[0].file.path);
const readmeContent = await app.vault.read(readmeFile);
console.log(readmeContent);

for (const element of hiringPage) {
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

	const hiringArticles = await dv.queryMarkdown(`
		LIST WITHOUT ID
			"[[" + file.path + "|" + title + "]]" 
		FROM "hiring" and !"_templates" and !"_templater" and !"_index" and !"site-index" and !"README"
		WHERE title != NULL
	`);
	content += hiringArticles.value;
	content += `\n\n---\n\n`;
	content += readmeContent;

	// get folder and file path
	const filePath = app.vault.getAbstractFileByPath(element.file.path);
	const folder = app.vault.getAbstractFileByPath(element.file.folder);

	// delete the file
	await app.vault.trash(filePath, true);

	// create a new file with the matching template
	await tp.file.create_new(content, element.file.name, false, folder);
}
%>