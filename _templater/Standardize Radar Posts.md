<%*
const dv = this.app.plugins.plugins["dataview"].api;
const postTemplate = dv.pages(`"_templater/New Post"`);
const radarPages = dv.pages(`"radar and !radar/README.md"`)

const titleCase = (s) => s
	.replace (/^[-_]*(.)/, (_, c) => c.toUpperCase())
	.replace (/[-_]+(.)/g, (_, c) => ' ' + c.toUpperCase())

for (const element of radarPages) {
	const frontmatter = { ...postTemplate[0].file.frontmatter, ...element.file.frontmatter };
	let content = "---\n";
	for (const prop in frontmatter) {
	    let value = element.file.frontmatter[prop];
	
	    // Default values for certain properties
	    if (value === undefined) {
	        if (prop === "menu") {
	            value = "radar";
	        } else if (prop === "show_frontmatter") {
	            value = true;
	        } else if (prop === "date" && frontmatter.created) {
	            value = frontmatter.created;
	        } else if (prop === "title") {
	            value = titleCase(element.file.name);
	        }
	    }
	
	    // Special handling for tags and arrays
	    if (prop === "tags" && typeof value == "string") {
	        value = `\n  - ${value.split(", ").join("\n  - ")}`;
	    } else if (Array.isArray(value) && value.length > 0) {
	        value = `\n  - ${value.join("\n  - ")}`;
	    }
	
	    // Add property to content
	    content += `${prop}: ${value ?? null}\n`;
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