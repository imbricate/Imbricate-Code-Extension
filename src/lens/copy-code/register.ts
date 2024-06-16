/**
 * @author WMXPY
 * @namespace Lens_CopyPreCode
 * @description Register
 */

import { resolveImbricateTempDirectory } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { CopyCodeProvider } from "./provider";

export const registerCodeLensProvider = (
    context: vscode.ExtensionContext,
): void => {

    const provider = CopyCodeProvider.create();

    const rootFolder = resolveImbricateTempDirectory();
    const rootUri = vscode.Uri.file(rootFolder);

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
