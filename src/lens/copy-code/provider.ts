/**
 * @author WMXPY
 * @namespace Lens_CopyCode
 * @description Provider
 */

import * as vscode from "vscode";
import { CONFIG_KEY, getConfiguration } from "../../configuration/get-config";

export class CopyCodeProvider implements vscode.CodeLensProvider {

    public static create(): CopyCodeProvider {

        return new CopyCodeProvider();
    }

    private constructor() { }

    public provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {

        const enabled: boolean = getConfiguration(CONFIG_KEY.COPY_SNIPPET_ENABLE);
        if (!enabled) {
            return [];
        }

        const result: vscode.CodeLens[] = [];

        let codeBlockStartLine: number | null = null;

        lines: for (let i = 0; i < document.lineCount; i++) {

            const line = document.lineAt(i);
            const lineText: string = line.text;

            const trimmedText: string = lineText.trim();

            if (codeBlockStartLine === null) {

                if (trimmedText.startsWith("```")) {

                    codeBlockStartLine = i;
                    continue lines;
                }
            } else {

                if (trimmedText === "```") {
                    codeBlockStartLine = null;
                } else {
                    continue lines;
                }
            }

            result.push(...this._parseText(i, 0, lineText));
        }

        return result;
    }

    public resolveCodeLens(codeLens: vscode.CodeLens): vscode.CodeLens {

        return codeLens;
    }

    private _parseText(
        lineNumber: number,
        startIndex: number,
        text: string,
    ): vscode.CodeLens[] {

        const results: vscode.CodeLens[] = [];

        const index: number = text.indexOf("`");

        if (index !== -1
            && text[index + 1] !== "`"
        ) {

            const restOfText: string = text.slice(index + 1);

            const nextIndex: number = restOfText.indexOf("`");
            if (nextIndex === -1) {
                return results;
            }

            if (restOfText[nextIndex + 1] === "`") {
                return results;
            }

            const range = new vscode.Range(
                new vscode.Position(lineNumber, startIndex + index + 1),
                new vscode.Position(lineNumber, startIndex + index + nextIndex + 1),
            );

            const fullText: string = restOfText.slice(0, nextIndex);
            let shortText: string = fullText;
            if (fullText.length > 8) {
                shortText = shortText.slice(0, 8) + "...";
            }

            const codeLens = new vscode.CodeLens(range);
            codeLens.command = {
                title: `Copy "${shortText}"`,
                tooltip: `Copy "${fullText}" to clipboard`,
                command: "imbricate.document.copy.code-block",
                arguments: [
                    range,
                ],
            };
            results.push(codeLens);

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
