/**
 * @author WMXPY
 * @description Extension
 */

import { resolveImbricateHomeDirectory } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { registerPageEditCommand } from "./command/page-edit";
import { registerPagePreviewCommand } from "./command/page-preview";
import { registerRefreshCommand } from "./command/refresh";
import { registerScriptEditCommand } from "./command/script-edit";
import { initializeOriginManager } from "./configuration/initialize";
import { readCLIConfiguration } from "./configuration/io";
import { registerPagesTreeView } from "./pages-tree-view/register";
import { registerScriptsTreeView } from "./scripts-tree-view/register";

export const activate = async (context: vscode.ExtensionContext) => {

	console.log('Imbricate Activities');

	const configurationPath: string = resolveImbricateHomeDirectory();
	const configuration = await readCLIConfiguration(configurationPath);

	const originManager = initializeOriginManager(configuration);

	registerPagesTreeView(configuration, originManager);
	registerScriptsTreeView(configuration, originManager);

	const pageEditDisposable = registerPageEditCommand();
	context.subscriptions.push(pageEditDisposable);

	const pagePreviewDisposable = registerPagePreviewCommand();
	context.subscriptions.push(pagePreviewDisposable);

	const refreshDisposable = registerRefreshCommand();
	context.subscriptions.push(refreshDisposable);

	const scriptEditDisposable = registerScriptEditCommand();
	context.subscriptions.push(scriptEditDisposable);
}

export const deactivate = () => {

	console.log('Imbricate Deactivated');
};
