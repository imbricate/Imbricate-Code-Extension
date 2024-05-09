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

        console.log(text);
        await vscode.env.clipboard.writeText(text);
    });

    return disposable;
};
