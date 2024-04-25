/**
 * @author WMXPY
 * @description Extension
 */

import { IImbricateConfigurationOrigin, ImbricateOriginInitializer, resolveImbricateHomeDirectory } from "@imbricate/local-fundamental";
import { FileSystemImbricateOrigin, FileSystemOriginPayload } from "@imbricate/origin-file-system";
import * as vscode from "vscode";
import { readCLIConfiguration } from "./configuration/io";
import { PagesTreeViewDataProvider } from "./pages-tree-view/data-provider";
import { ScriptsTreeViewDataProvider } from "./scripts-tree-view/data-provider";

export const activate = async (context: vscode.ExtensionContext) => {

	const originInitializer: ImbricateOriginInitializer = ImbricateOriginInitializer.create();

	originInitializer.registerOriginConstructor(
		"file-system",
		(origin: IImbricateConfigurationOrigin) => {
			return FileSystemImbricateOrigin.withPayloads(
				origin.payloads as FileSystemOriginPayload,
			);
		}
	);

	const configurationPath: string = resolveImbricateHomeDirectory();
	const configuration = await readCLIConfiguration(configurationPath);

	const originManager = originInitializer.initializeOrigins(configuration.origins);

	console.log('Congratulations, your extension "imbricate" is now active!');

	const pagesDataProvider = await PagesTreeViewDataProvider.create(
		configuration,
		originManager,
	);

	vscode.window.registerTreeDataProvider("imbricate-pages", pagesDataProvider);

	const scriptsDataProvider = await ScriptsTreeViewDataProvider.create(
		configuration,
		originManager,
	);

	vscode.window.registerTreeDataProvider("imbricate-scripts", scriptsDataProvider);

	const disposable = vscode.commands.registerCommand("imbricate.refresh", () => {
		vscode.window.showInformationMessage("Hello World from imbricate!");
	});

	context.subscriptions.push(disposable);
}

export const deactivate = () => {

	console.log('Your extension "imbricate" is now deactivated!');
};
