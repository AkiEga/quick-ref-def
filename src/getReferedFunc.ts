import * as vscode from 'vscode';

async function getReferedFunc(selection: vscode.Selection): Promise<vscode.Location[]> {
	let uri = vscode.window.activeTextEditor?.document.uri;
	let refLoc: vscode.Location[] = [];

	if (uri) {
		refLoc = <vscode.Location[]>await vscode.commands.executeCommand("vscode.executeReferenceProvider", uri, selection.start);
	}

	return new Promise((resolve) => {
		resolve(refLoc);
	});
}
export async function getReferedFuncRecursive(selection: vscode.Selection, uri: vscode.Uri): Promise<vscode.Location[]|void> {
	let refLoc: vscode.Location[] = [];
	let newRefLoc: vscode.Location[]|void = [];
	refLoc = <vscode.Location[]> await vscode.commands.executeCommand("vscode.executeReferenceProvider", uri, selection.start);

	refLoc.forEach(async (ref) => {
		let refSel: vscode.Selection = new vscode.Selection(ref.range.start, ref.range.end);
		let refUri: vscode.Uri = ref.uri;
		newRefLoc = await getReferedFuncRecursive(refSel, refUri);
	});
	
	if(newRefLoc){
		refLoc.concat(newRefLoc);
	}
	return new Promise((resolve) => {
		resolve(refLoc);
	});
}
