<%*
const dv = this.app.plugins.plugins["dataview"].api;
const postTemplate = dv.pages(`"_templater/New Post"`);
const hiringPages = dv.pages(`"hiring and !hiring/README.md"`)

const titleCase = (s) => s
	.replace (/^[-_]*(.)/, (_, c) => c.toUpperCase())
	.replace (/[-_]+(.)/g, (_, c) => ' ' + c.toUpperCase())

for (const element of hiringPages) {
	const frontmatter = { ...postTemplate[0].file.frontmatter, ...element.file.frontmatter };
	let content = "---\n";
	for (const prop in frontmatter) {
		const value = element.file.frontmatter[prop]

		if (prop === "menu" && value === undefined) {
			content += `${prop}: hiring\n`;
		}
		else if (prop === "show_frontmatter" && value === undefined) {
			content += `${prop}: true\n`;
		}
		else if (prop === "date" && frontmatter.created) {
			content += `${prop}: ${frontmatter.created}\n`;
		}
		else if (prop === "title" && value === undefined) {
			content += `${prop}: ${titleCase(element.file.name)}\n`;
		}
		else {
			content += `${prop}: ${frontmatter[prop]}`
		}

		if (prop === "tags" && typeof value == "string") {
			content += `${prop}: \n  - ${value.split(", ").join("\n  - ")}\n`;
		}
		else if (Array.isArray(value) && value.length > 0) {
			content += `${prop}: \n  - ${value.join("\n  - ")}\n`;
		} else {
			content += `${prop}: ${value || null}\n`;
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