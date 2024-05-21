/**
 * @author WMXPY
 * @namespace Command
 * @description History Reset
 */

import * as vscode from "vscode";
import { HistoryTreeViewDataProvider } from "../history-tree-view/data-provider";

export const registerHistoryResetCommand = (
    historiesDataProvider: HistoryTreeViewDataProvider,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand("imbricate.history.reset", async () => {

        historiesDataProvider.resetRecords();
    });

    return disposable;
};
