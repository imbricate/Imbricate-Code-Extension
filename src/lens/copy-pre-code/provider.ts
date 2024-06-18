/**
 * @author WMXPY
 * @namespace Lens_CopyPreCode
 * @description Provider
 */

import * as vscode from "vscode";
import { CONFIG_KEY, getConfiguration } from "../../configuration/get-config";

export class CopyPreCodeProvider implements vscode.CodeLensProvider {

    public static create(): CopyPreCodeProvider {

        return new CopyPreCodeProvider();
    }

    private constructor() { }

    public provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {

        const enabled: boolean = getConfiguration(CONFIG_KEY.COPY_CODE_BLOCK_ENABLE);
        if (!enabled) {
            return [];
        }

        const result: vscode.CodeLens[] = [];

        let codeBlockStartLine: number | null = null;

        lines: for (let i = 0; i < document.lineCount; i++) {

            const line = document.lineAt(i);
            const lineText: string = line.text.trim();

            if (codeBlockStartLine === null) {

                if (lineText.startsWith("```")) {

                    codeBlockStartLine = i;
                    continue lines;
                }
                continue lines;
            }

            if (lineText === "```") {

                if (i === codeBlockStartLine + 1) {
                    codeBlockStartLine = null;
                    continue lines;
                }

                const range = new vscode.Range(
                    new vscode.Position(codeBlockStartLine, 0),
                    new vscode.Position(i, line.range.end.character),
                );

                const codeLens = new vscode.CodeLens(range);
                result.push(codeLens);

                codeBlockStartLine = null;
                continue lines;
            }
        }

        return result;
    }

    public resolveCodeLens(codeLens: vscode.CodeLens): vscode.CodeLens {

        codeLens.command = {
            title: "Copy code block",
            tooltip: "Copy this code block",
            command: "imbricate.document.copy.code-block",
            arguments: [
                codeLens.range,
            ],
        };
        return codeLens;
    }
}
