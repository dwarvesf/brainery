<%*
const dv = this.app.plugins.plugins["dataview"].api;
const membersList = dv.pages(`"members"`);

for (const element of membersList) {
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

	const profileTable = await dv.queryMarkdown(`
		TABLE WITHOUT ID
			"![avatar\|100x100](" + avatar + ")" as ${element.file.name},
			join(social, "<br>") as contact
		FROM "members" and !"_templates" and !"_templater" and !"_index" and !"site-index" and !"README
		WHERE file.name = "${element.file.name}"
	`);
	content += `<div class="profile"/>\n\n${profileTable.value}\n`;

	const memberArticles = await dv.queryMarkdown(`
		LIST WITHOUT ID "[[" + file.path + "|" + title + "]]"
		FROM "/"
		WHERE contains(authors, "${element.file.name}")
	`);
	content += `## Written Notes\n\n${memberArticles.value}`;

	// get folder and file path
	const filePath = app.vault.getAbstractFileByPath(element.file.path);
	const folder = app.vault.getAbstractFileByPath(element.file.folder);

	// delete the file
	await app.vault.trash(filePath, true);

	// create a new file with the matching template
	await tp.file.create_new(content, element.file.name, false, folder);
}
%>