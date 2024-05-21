/**
 * @author WMXPY
 * @description Extension
 */

import { readOrCreateImbricateConfiguration, resolveImbricateHomeDirectory } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { initializeOriginManager } from "./configuration/initialize";
import { registerOperations } from "./register";
import { logVerbose } from "./util/output-channel";

export const activate = async (context: vscode.ExtensionContext) => {

	logVerbose("Imbricate Activated");

	const configurationPath: string = resolveImbricateHomeDirectory();
	const configuration = await readOrCreateImbricateConfiguration(configurationPath);

	const originManager = await initializeOriginManager(configuration);

	await registerOperations(
		configuration,
		originManager,
		context,
	);
};

export const deactivate = () => {

	logVerbose("Imbricate Deactivated");
};
