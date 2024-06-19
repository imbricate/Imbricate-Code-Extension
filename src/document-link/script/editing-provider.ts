/**
 * @author WMXPY
 * @namespace DocumentLink_Script
 * @description Provider
 */

import * as vscode from "vscode";
import { CONFIG_KEY, getConfiguration } from "../../configuration/get-config";
import { logVerbose } from "../../util/output-channel";
import { concatScriptJavascriptUrl } from "../../virtual-document/script-javascript/concat";

export class EditingScriptDocumentLinkProvider implements vscode.DocumentLinkProvider {

    public static create(): EditingScriptDocumentLinkProvider {

        return new EditingScriptDocumentLinkProvider();
    }

    private constructor() {

        logVerbose("Editing Script Document Link Provider Created");
    }

    public provideDocumentLinks(
        document: vscode.TextDocument,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.DocumentLink[]> {

        const enabled: boolean = getConfiguration(CONFIG_KEY.REDIRECT_INLINE_ENABLE);
        if (!enabled) {
            return [];
        }

        const result: vscode.DocumentLink[] = [];

        let codeBlockStartLine: number | null = null;

        lines: for (let i = 0; i < document.lineCount; i++) {

            const line = document.lineAt(i);
            const lineText: string = line.text.trim();

            if (codeBlockStartLine === null) {

                if (lineText.startsWith("```")) {

                    codeBlockStartLine = i;
                    continue lines;
                }
            } else {

                if (lineText === "```") {
                    codeBlockStartLine = null;
                } else {
                    continue lines;
                }
            }

            result.push(...this._parseText(i, 0, lineText));
        }

        return result;
    }

    private _parseText(
        lineNumber: number,
        startIndex: number,
        text: string,
    ): vscode.DocumentLink[] {

        const linkIndex: number = text.indexOf("_$");
        const codeIndex: number = text.indexOf("`");

        if (codeIndex !== -1) {

            if (codeIndex < linkIndex) {

                const nextCodeIndex: number = text.indexOf("`", codeIndex + 1);

                if (nextCodeIndex !== -1) {

                    return this._parseText(
                        lineNumber,
                        startIndex + nextCodeIndex + 1,
                        text.slice(nextCodeIndex + 1),
                    );
                }
            }
        }

        const results: vscode.DocumentLink[] = [];

        if (linkIndex !== -1) {

            const restOfText: string = text.slice(linkIndex + 1);

            const nextIndex: number = restOfText.indexOf("_");
            if (nextIndex === -1) {
                return results;
            }

            if (restOfText[nextIndex + 1] === "_") {
                return results;
            }

            const range = new vscode.Range(
                new vscode.Position(lineNumber, startIndex + linkIndex + 2),
                new vscode.Position(lineNumber, startIndex + linkIndex + nextIndex + 1),
            );

            const fullText: string = restOfText.slice(0, nextIndex);
            const uri = this._buildLinkUri(fullText);

            const documentLink = new vscode.DocumentLink(range, uri);
            results.push(documentLink);

            const restOfRestOfText: string = restOfText.slice(nextIndex + 1);
            results.push(
                ...this._parseText(
                    lineNumber,
                    startIndex + linkIndex + 1 + nextIndex + 1,
                    restOfRestOfText,
                ),
            );
        }

        return results;
    }

    private _buildLinkUri(
        fullText: string,
    ): vscode.Uri {

        const splitedText: string[] = fullText.split(":");

        let component1: string = splitedText[0];
        if (component1.startsWith("$")) {
            component1 = component1.slice(1);
        }
        const component2: string = splitedText[1];

        return concatScriptJavascriptUrl(
            component1,
            component2,
        );
    }
}
