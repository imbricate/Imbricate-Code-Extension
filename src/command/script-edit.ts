/**
 * @author WMXPY
 * @namespace Command
 * @description Script Edit
 */

import * as vscode from "vscode";

export const registerScriptEditCommand = (): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand("imbricate.script.edit", () => {
        vscode.window.showInformationMessage("Hello World from imbricate!");
    });

    return disposable;
};
