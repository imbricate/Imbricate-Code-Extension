/**
 * @author WMXPY
 * @namespace DocumentLink_Page
 * @description Register
 */

import { resolveImbricateTempDirectory } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { EditingPageDocumentLinkProvider } from "./editing-provider";

export const registerPageDocumentLinkProvider = (
    context: vscode.ExtensionContext,
): void => {

    const editingProvider = EditingPageDocumentLinkProvider.create();

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
};
