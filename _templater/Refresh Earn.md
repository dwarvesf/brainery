<%*
const dv = this.app.plugins.plugins["dataview"].api;
const baseEarnPage = dv.pages(`"earn/_base.md"`);
const indexEarnPage = dv.pages(`"earn/_index.md"`);

async function asyncReplace(str, regex, asyncFn) {
    const promises = [];
    str.replace(regex, (match, ...args) => {
        const promise = asyncFn(match, ...args);
        promises.push(promise);
    });

    const data = await Promise.all(promises);
    return str.replace(regex, () => data.shift());
}

// get folder and file path
const baseFile = app.vault.getAbstractFileByPath(baseEarnPage[0].file.path);
const indexFile = app.vault.getAbstractFileByPath(indexEarnPage[0].file.path);
const fileContent = await app.vault.read(baseFile);

const dataviewRegex = /^```dataview[\s\S]*?^```/m;
const dataviews = await asyncReplace(fileContent, dataviewRegex, async (match) => {
	const dataviewLines = match.split('\n');
	dataviewLines.shift();
	dataviewLines.pop();
	
	const parsedDataview = dataviewLines.join('\n')
	const dataviewMarkdown = await dv.queryMarkdown(parsedDataview);
	
	return dataviewMarkdown.value
});

await app.vault.modify(indexFile, dataviews);
%>