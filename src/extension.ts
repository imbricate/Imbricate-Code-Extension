/**
 * @author WMXPY
 * @description Extension
 */

import { resolveImbricateHomeDirectory } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { initializeOriginManager } from "./configuration/initialize";
import { readCLIConfiguration } from "./configuration/io";
import { registerOperations } from "./register";

export const activate = async (context: vscode.ExtensionContext) => {

	console.log('Imbricate Activities');

	const configurationPath: string = resolveImbricateHomeDirectory();
	const configuration = await readCLIConfiguration(configurationPath);

	const originManager = initializeOriginManager(configuration);

	await registerOperations(
		configuration,
		originManager,
		context,
	);
}

export const deactivate = () => {

	console.log('Imbricate Deactivated');
};
