<%*
const dv = this.app.plugins.plugins["dataview"].api;
const indexPage = dv.pages(`"site-index"`);

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
	let groups = dv.pages(`"" AND !"playbook"`)
	    .where(p => p.file.folder != "_templater")
	    .where(p => p.file.folder != "assets")
	    .where(p => p.file.name != "_base")
	    .sort(p => p.file.name)
	    .groupBy(p => p.file.name.substring(0,1).toUpperCase())
	
	for (let group of groups) {
	    content += `\n\n## ${group.key}\n\n- `;
		const rows = group.rows
	       .sort(k => k.file.name)
	       .map(k => `[[${k.file.name}\|${k.title}]]`);
	    content += rows.join('\n- ');
	}

	// get folder and file path
	const file = app.vault.getAbstractFileByPath(element.file.path);
	const fileContent = await app.vault.read(file);

	await app.vault.modify(file, content);
}
%>