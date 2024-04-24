/**
 * @author WMXPY
 * @description Extension
 */

import * as vscode from "vscode";
import { ImbricateActivityDataProvider } from "./activity-bar/data-provider";

export const activate = async (context: vscode.ExtensionContext) => {

	console.log('Congratulations, your extension "imbricate" is now active!');

	const activityDataProvider = await ImbricateActivityDataProvider.fromHomeConfig();

	vscode.window.registerTreeDataProvider("imbricate", activityDataProvider);
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand("imbricate.helloWorld", () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage("Hello World from imbricate!");
	});

	vscode.window.showInformationMessage("Hello World from imbricate!");

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export const deactivate = () => {

	console.log('Your extension "imbricate" is now deactivated!');
};
