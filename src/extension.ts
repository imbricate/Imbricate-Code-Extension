/**
 * @author WMXPY
 * @description Extension
 */

import { readOrCreateImbricateConfiguration, resolveImbricateHomeDirectory } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { initializeOriginManager } from "./configuration/initialize";
import { registerOperations } from "./register";

export const activate = async (context: vscode.ExtensionContext) => {

	console.log("Imbricate Activities");

	const configurationPath: string = resolveImbricateHomeDirectory();
	const configuration = await readOrCreateImbricateConfiguration(configurationPath);

	const originManager = initializeOriginManager(configuration);

	await registerOperations(
		configuration,
		originManager,
		context,
	);
};

export const deactivate = () => {

	console.log("Imbricate Deactivated");
};
