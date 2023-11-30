<%*
const dv = this.app.plugins.plugins["dataview"].api;
const basePages = dv.pages().where((p) => p.file.name.includes('_base'))

async function asyncReplace(str, regex, asyncFn) {
    const promises = [];
    str.replace(regex, (match, ...args) => {
        const promise = asyncFn(match, ...args);
        promises.push(promise);
    });

    const data = await Promise.all(promises);
    return str.replace(regex, () => data.shift());
}

const indexFileName = "_index.md"
for (const element of basePages) {
	const basePathList = element.file.path.split('/');
	basePathList[basePathList.length - 1] = indexFileName;

	const basePath = element.file.path;
	const indexPath = basePathList.join('/');

	const baseFile = app.vault.getAbstractFileByPath(basePath);
	const indexFile = app.vault.getAbstractFileByPath(indexPath);

	const baseContent = await app.vault.read(baseFile);
	let indexContent;
	try {
		await app.vault.read(indexFile);
	}
	catch (err) {
		const folder = app.vault.getAbstractFileByPath(element.file.folder)
		await tp.file.create_new("", indexFileName, false, folder);
		break;
	}

	const dataviewRegex = /^```dataview[\s\S]*?^```/gm;
	const dataviews = await asyncReplace(baseContent, dataviewRegex, async (match) => {
		const dataviewLines = match.split('\n');
		dataviewLines.shift();
		dataviewLines.pop();
		
		const parsedDataview = dataviewLines.join('\n')
		const dataviewMarkdown = await dv.queryMarkdown(parsedDataview);
		console.log(match);

		return dataviewMarkdown.value
	});
	
	await app.vault.modify(indexFile, dataviews);
}
%>