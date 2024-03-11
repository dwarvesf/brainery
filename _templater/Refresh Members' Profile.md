<%*
const dv = this.app.plugins.plugins["dataview"].api;
const membersList = dv.pages(`"contributor"`);

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
		FROM "contributor"
		WHERE file.name = "${element.file.name}"
	`);
	content += `<div class="profile"/>\n\n${profileTable.value}\n`;
	const aliases = dv.pages(`"contributor"`)
		.where(p => p.file.name === element.file.name)
		.values[0].aliases ?? [];

	const articles = dv.pages(`"/" and !"_base"`)
		.where(p => !p.file.name.includes("_base"))
		.where(p => p.file.name !== "home")
		.where(p => (p.authors ?? []).some(a => (aliases ?? []).includes(a)));

	const articleTexts = articles.map(p => `- [[${p.file.path}|${p.title}]]`);
	console.log({
		aliases,
		articles,
		articleTexts
	})

	content += `## Contributed Notes\n\n${articleTexts.join('\n')}`;

	// get folder and file path
	const file = app.vault.getAbstractFileByPath(element.file.path);
	const fileContent = await app.vault.read(file);

	await app.vault.modify(file, content);
}
%>