/**
 * @author WMXPY
 * @namespace DocumentLink_Page
 * @description Provider
 */

import * as vscode from "vscode";
import { concatPageMarkdownUrl } from "../../virtual-document/page-markdown/concat";

export class PageDocumentLinkProvider implements vscode.TextDocumentContentProvider, vscode.DocumentLinkProvider {

    public static create(): PageDocumentLinkProvider {

        return new PageDocumentLinkProvider();
    }

    private constructor() { }

    public provideTextDocumentContent(
        uri: vscode.Uri,
        token: vscode.CancellationToken,
    ): vscode.ProviderResult<string> {

        console.log(uri, token);

        throw new Error("Method not implemented.");
    }

    public provideDocumentLinks(
        document: vscode.TextDocument,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.DocumentLink[]> {

        const range = new vscode.Range(
            new vscode.Position(0, 0),
            new vscode.Position(0, 5),
        );

        const uri = concatPageMarkdownUrl(
            "item.originName",
            "item.collection.uniqueIdentifier",
            "item.pageSnapshot.identifier",
        );

        const documentLink = new vscode.DocumentLink(range, uri);
        return [documentLink];
    }
}
