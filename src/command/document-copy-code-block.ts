/**
 * @author WMXPY
 * @namespace Command
 * @description Document Copy Code Block
 */

import * as vscode from "vscode";

export const registerDocumentCopyCodeBlockCommand = (): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.document.copy.code-block", async (
            range: vscode.Range,
        ) => {

        const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const text: string = editor.document.getText(range);

        const result: string[] = [];
        const lines: string[] = text.split("\n");

        for (let i = 0; i < lines.length; i++) {

            if (i === 0 && lines[i].startsWith("```")) {
                continue;
            }
            if (i === lines.length - 1 && lines[i].startsWith("```")) {
                continue;
            }

            result.push(lines[i]);
        }

        if (lines[lines.length - 1].length === 0) {
            result.pop();
        }

        await vscode.env.clipboard.writeText(
            result.join("\n"),
        );
    });

    return disposable;
};
