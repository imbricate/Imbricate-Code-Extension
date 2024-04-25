/**
 * @author WMXPY
 * @namespace Command
 * @description Page Edit
 */

import * as vscode from "vscode";

export const registerPageEditCommand = (): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand("imbricate.page.edit", () => {
        vscode.window.showInformationMessage("Hello World from imbricate!");
    });

    return disposable;
};
