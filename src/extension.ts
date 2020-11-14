// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

async function getReferedFunc(selection: vscode.Selection): Promise<vscode.Location[]> {
	let uri = vscode.window.activeTextEditor?.document.uri;
	let refLoc: vscode.Location[] = [];

	if(uri){
		refLoc = <vscode.Location[]>await vscode.commands.executeCommand("vscode.executeReferenceProvider", uri, selection.start);
	}
	
	return new Promise((resolve) => {
		resolve(refLoc);
	});
}

async function getReferedFuncRecursive(selection: vscode.Selection, uri:vscode.Uri): 
	Promise<vscode.Location[] >
{
	let refLoc: vscode.Location[] = [];

	refLoc = <vscode.Location[]>await vscode.commands.executeCommand("vscode.executeReferenceProvider", uri, selection.start);
	
	let newRefLoc: vscode.Location[] = [];
	refLoc.forEach(async (ref)=>{
		let refSel:vscode.Selection =new vscode.Selection(ref.range.start, ref.range.end);
		let refUri:vscode.Uri = ref.uri;
		newRefLoc = await getReferedFuncRecursive(refSel,refUri);
	});

	refLoc.concat(newRefLoc);
	
	return new Promise((resolve) => {
		resolve(refLoc);
	});
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "quick-ref-def" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('quick-ref-def.showReferedFunc', () => {
		// The code you place here will be executed every time your command is executed
		let activeTextEditor = vscode.window.activeTextEditor;

		if(activeTextEditor){
			let selection:vscode.Selection = activeTextEditor.selection;
			getReferedFuncRecursive(selection,activeTextEditor.document.uri).then
			((refs:vscode.Location[])=>{
				console.log(refs);
			});
		}
		// Display a message box to the user
		
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
