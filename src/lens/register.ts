/**
 * @author WMXPY
 * @namespace Lens
 * @description Register
 */

import { resolveImbricateTempDirectory } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { CopyPreCodeProvider } from "./provider";

export const registerPreCodeLensProvider = (
    context: vscode.ExtensionContext,
): void => {

    const provider = CopyPreCodeProvider.create();

    const rootFolder = resolveImbricateTempDirectory();
    const rootUri = vscode.Uri.parse(rootFolder);

    const disposable = vscode.languages.registerCodeLensProvider(
        {
            language: "markdown",
            pattern: `${rootUri.fsPath}/**/*`,
        },
        provider,
    );
    context.subscriptions.push(disposable);
};
