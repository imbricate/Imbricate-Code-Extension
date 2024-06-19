/**
 * @author WMXPY
 * @namespace DocumentLink_Script
 * @description Register
 */

import { resolveImbricateTempDirectory } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { EditingScriptDocumentLinkProvider } from "./editing-provider";

export const registerScriptDocumentLinkProvider = (
    context: vscode.ExtensionContext,
): void => {

    const editingProvider = EditingScriptDocumentLinkProvider.create();

    const rootFolder = resolveImbricateTempDirectory();
    const rootUri = vscode.Uri.file(rootFolder);

    const editingDisposable = vscode.languages.registerDocumentLinkProvider(
        {
            language: "markdown",
            scheme: "file",
            pattern: {
                baseUri: rootUri,
                base: rootUri.fsPath,
                pattern: "**/*.md",
            },
        },
        editingProvider,
    );
    context.subscriptions.push(editingDisposable);

    const previewDisposable = vscode.languages.registerDocumentLinkProvider(
        {
            language: "markdown",
            scheme: "imbricate-page-markdown",
        },
        editingProvider,
    );
    context.subscriptions.push(previewDisposable);
};
