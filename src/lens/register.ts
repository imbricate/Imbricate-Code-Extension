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

    const editingDisposable = vscode.languages.registerCodeLensProvider(
        {
            language: "markdown",
            scheme: "file",
            pattern: {
                baseUri: rootUri,
                base: rootUri.fsPath,
                pattern: "**/*.md",
            },
        },
        provider,
    );
    context.subscriptions.push(editingDisposable);

    const previewDisposable = vscode.languages.registerCodeLensProvider(
        {
            language: "markdown",
            scheme: "imbricate-page-markdown",
        },
        provider,
    );
    context.subscriptions.push(previewDisposable);
};
