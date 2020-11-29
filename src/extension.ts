// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as path from 'path';
import * as vscode from 'vscode';
import { getReferedFuncRecursive } from './getReferedFunc';

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
			((refs:vscode.Location[]|void)=>{
				if(refs){
					refs.forEach((loc:vscode.Location)=>{
						let uri = loc.uri;
						let doc: vscode.TextDocument | undefined 
							= vscode.workspace.textDocuments.find((doc : vscode.TextDocument) => {
								return doc.uri.path.toLocaleLowerCase() === loc.uri.path.toLocaleLowerCase();
						});
						if(doc){
							let txt = doc.getText(loc.range);
							let line = loc.range.start.line+1;
							let column = loc.range.start.character;
							console.log(`loc: ${uri.fsPath.toString()}:${line}:${column}`);
							console.log(`func: ${txt}`);
						}
					});
				}
				
			});
		}
		// Display a message box to the user
		
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
