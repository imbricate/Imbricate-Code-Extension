/**
 * @author WMXPY
 * @namespace Command
 * @description Refresh
 */

import * as vscode from "vscode";

export const registerRefreshCommand = (): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand("imbricate.refresh", () => {
        vscode.window.showInformationMessage("Hello World from imbricate!");
    });

    return disposable;
};
