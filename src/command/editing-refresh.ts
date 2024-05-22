/**
 * @author WMXPY
 * @namespace Command
 * @description Editing Refresh
 */

import * as vscode from "vscode";
import { EditingTreeViewDataProvider } from "../editing-tree-view/data-provider";

export const registerEditingsRefreshCommand = (
    editingsDataProvider: EditingTreeViewDataProvider,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.editings.refresh", (
    ) => {
        editingsDataProvider.refresh();
    });

    return disposable;
};
