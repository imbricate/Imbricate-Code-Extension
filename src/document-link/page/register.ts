/**
 * @author WMXPY
 * @namespace DocumentLink_Page
 * @description Register
 */

import { resolveImbricateTempDirectory } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { PageDocumentLinkProvider } from "./provider";

export const registerPageDocumentLinkProvider = (
    context: vscode.ExtensionContext,
): void => {

    const provider = PageDocumentLinkProvider.create();

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
        provider,
    );

    context.subscriptions.push(editingDisposable);
};
