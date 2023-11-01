<%*
const dv = this.app.plugins.plugins["dataview"].api;
const postTemplate = dv.pages(`"_templater/New Post"`);
const memoPages = dv.pages(`"memo"`)

for (const element of memoPages) {
	const frontmatter = { ...postTemplate[0].file.frontmatter, ...element.file.frontmatter };
	let content = "---\n";
	for (const prop in frontmatter) {
		const value = element.file.frontmatter[prop]
		if (prop ==="tags" && typeof value == "string") {
			content += `${prop}: \n  - ${value.split(", ").join("\n  - ")}\n`;
		}
		else if (Array.isArray(value) && value.length > 0) {
			content += `${prop}: \n  - ${value.join("\n  - ")}\n`;
		} else {
			content += `${prop}: ${value}\n`;
		}
	}
	content += "---\n";

	const file = app.vault.getAbstractFileByPath(element.file.path);
	const fileContent = await app.vault.read(file);

	const frontmatterRegex = /^---[\s\S]*?^---\n/m;
	const currentContent = fileContent.replace(frontmatterRegex, "")
	const joinedContent = content + currentContent;
	await app.vault.modify(file, joinedContent);
}
%>