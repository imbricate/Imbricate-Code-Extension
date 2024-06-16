/**
 * @author WMXPY
 * @namespace Lens_CopyCode
 * @description Provider
 */

import * as vscode from "vscode";

export class CopyCodeProvider implements vscode.CodeLensProvider {

    public static create(): CopyCodeProvider {

        return new CopyCodeProvider();
    }

    private constructor() { }

    public provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {

        const result: vscode.CodeLens[] = [];

        for (let i = 0; i < document.lineCount; i++) {

            const line = document.lineAt(i);
            const lineText: string = line.text.trim();

            result.push(...this._parseText(i, lineText));
        }

        return result;
    }

    public resolveCodeLens(codeLens: vscode.CodeLens): vscode.CodeLens {

        codeLens.command = {
            title: "Copy",
            tooltip: "Copy this block",
            command: "imbricate.document.copy.code-block",
            arguments: [
                codeLens.range,
            ],
        };
        return codeLens;
    }

    private _parseText(lineNumber: number, text: string): vscode.CodeLens[] {

        const results: vscode.CodeLens[] = [];

        const index: number = text.indexOf("`");
        if (index === -1
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
                new vscode.Position(lineNumber, index),
                new vscode.Position(lineNumber, nextIndex),
            );

            const codeLens = new vscode.CodeLens(range);
            results.push(codeLens);

            const restOfRestOfText: string = restOfText.slice(nextIndex + 1);
            return results.concat(this._parseText(lineNumber, restOfRestOfText));
        }

        return results;
    }
}
