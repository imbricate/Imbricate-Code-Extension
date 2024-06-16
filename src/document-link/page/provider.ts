/**
 * @author WMXPY
 * @namespace DocumentLink_Page
 * @description Provider
 */

import * as vscode from "vscode";

export class PageDocumentLinkProvider implements vscode.DocumentLinkProvider {

    public static create(): PageDocumentLinkProvider {

        return new PageDocumentLinkProvider();
    }

    private constructor() { }

    public provideDocumentLinks(
        document: vscode.TextDocument,
        token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.DocumentLink[]> {

        console.log(document, token);

        throw new Error("Method not implemented.");
    }
}
