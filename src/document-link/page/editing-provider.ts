/**
 * @author WMXPY
 * @namespace DocumentLink_Page
 * @description Provider
 */

import * as vscode from "vscode";
import { logVerbose } from "../../util/output-channel";
import { concatPageMarkdownUrl } from "../../virtual-document/page-markdown/concat";

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

            const fullText: string = restOfText.slice(0, nextIndex);
            const splitedText: string[] = fullText.split(":");

            const uri = concatPageMarkdownUrl(
                splitedText[0],
                splitedText[1],
                splitedText[2],
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
}
