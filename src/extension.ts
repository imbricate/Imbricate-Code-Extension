/**
 * @author WMXPY
 * @description Extension
 */

import { IImbricateConfigurationOrigin, ImbricateOriginInitializer, resolveImbricateHomeDirectory } from "@imbricate/local-fundamental";
import { FileSystemImbricateOrigin, FileSystemOriginPayload } from "@imbricate/origin-file-system";
import * as vscode from "vscode";
import { registerRefreshCommand } from "./command/refresh";
import { readCLIConfiguration } from "./configuration/io";
import { registerPagesTreeView } from "./pages-tree-view/register";
import { registerScriptsTreeView } from "./scripts-tree-view/register";

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

	registerPagesTreeView(configuration, originManager);
	registerScriptsTreeView(configuration, originManager);

	const refreshDisposable = registerRefreshCommand();
	context.subscriptions.push(refreshDisposable);
}

export const deactivate = () => {

	console.log('Your extension "imbricate" is now deactivated!');
};
