/**
 * @author WMXPY
 * @namespace DocumentLink_Page
 * @description Register
 */

import * as vscode from "vscode";
import { PageDocumentLinkProvider } from "./provider";
import { resolveImbricateTempDirectory } from "@imbricate/local-fundamental";

export const registerPageDocumentLinkProvider = (
    context: vscode.ExtensionContext,
): void => {

    const provider = PageDocumentLinkProvider.create();

    const rootFolder = resolveImbricateTempDirectory();
    const rootUri = vscode.Uri.file(rootFolder);

    const providerRegistrations = vscode.Disposable.from(
        vscode.languages.registerDocumentLinkProvider(
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
        ),
    );

    context.subscriptions.push(
        providerRegistrations,
    );
};
