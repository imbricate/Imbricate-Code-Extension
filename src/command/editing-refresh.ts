/**
 * @author WMXPY
 * @namespace Command
 * @description Refresh
 */

import * as vscode from "vscode";
import { EditingTreeViewDataProvider } from "../editing-tree-view/data-provider";

export const registerEditingRefreshCommand = (
    editingsDataProvider: EditingTreeViewDataProvider,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand("imbricate.editing.refresh", () => {
        editingsDataProvider.refresh();
    });

    return disposable;
};
