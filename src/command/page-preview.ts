/**
 * @author WMXPY
 * @namespace Command
 * @description Page Preview
 */

import * as vscode from "vscode";

export const registerPagePreviewCommand = (): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand("imbricate.page.preview", () => {
        vscode.window.showInformationMessage("Hello World from imbricate!");
    });

    return disposable;
};
