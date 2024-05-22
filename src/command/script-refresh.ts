/**
 * @author WMXPY
 * @namespace Command
 * @description Script Refresh
 */

import * as vscode from "vscode";
import { ScriptsTreeViewDataProvider } from "../scripts-tree-view/data-provider";

export const registerScriptsRefreshCommand = (
    scriptsDataProvider: ScriptsTreeViewDataProvider,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.scripts.refresh", (
    ) => {
        scriptsDataProvider.refresh();
    });

    return disposable;
};
