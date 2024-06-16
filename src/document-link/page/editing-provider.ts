/**
 * @author WMXPY
 * @namespace DocumentLink_Page
 * @description Provider
 */

import * as vscode from "vscode";
import { concatPageMarkdownUrl } from "../../virtual-document/page-markdown/concat";
import { logVerbose } from "../../util/output-channel";

export class EditingPageDocumentLinkProvider implements vscode.DocumentLinkProvider {

    public static create(): EditingPageDocumentLinkProvider {

        return new EditingPageDocumentLinkProvider();
    }

    private constructor() {

        logVerbose("Editing Page Document Link Provider Created");
    }

    public provideDocumentLinks(
        document: vscode.TextDocument,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.DocumentLink[]> {

        console.log(document.uri.fsPath);

        const result: vscode.DocumentLink[] = [];

        for (let i = 0; i < document.lineCount; i++) {

            const line = document.lineAt(i);
            const lineText: string = line.text.trim();

            result.push(...this._parseText(i, 0, lineText));
        }

        return result;
    }

    private _parseText(
        lineNumber: number,
        startIndex: number,
        text: string,
    ): vscode.DocumentLink[] {

        const results: vscode.DocumentLink[] = [];

        const index: number = text.indexOf("_");

        if (index !== -1
            && text[index + 1] !== "_"
        ) {

            const restOfText: string = text.slice(index + 1);

            const nextIndex: number = restOfText.indexOf("_");
            if (nextIndex === -1) {
                return results;
            }

            if (restOfText[nextIndex + 1] === "_") {
                return results;
            }

            const range = new vscode.Range(
                new vscode.Position(lineNumber, startIndex + index + 1),
                new vscode.Position(lineNumber, startIndex + index + nextIndex + 1),
            );

            const uri = concatPageMarkdownUrl(
                "item.originName",
                "item.collection.uniqueIdentifier",
                "item.pageSnapshot.identifier",
            );

            const documentLink = new vscode.DocumentLink(range, uri);
            results.push(documentLink);

            const restOfRestOfText: string = restOfText.slice(nextIndex + 1);
            results.push(
                ...this._parseText(
                    lineNumber,
                    startIndex + index + 1 + nextIndex + 1,
                    restOfRestOfText,
                ),
            );
        }

        return results;
    }

    // private _buildTargetUri(
    //     value: string,
    // ): vscode.Uri {


    // }
}
