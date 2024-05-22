/**
 * @author WMXPY
 * @namespace Command
 * @description Script Show History
 */

import { IImbricateScript } from "@imbricate/core";
import * as vscode from "vscode";
import { HistoryTreeViewDataProvider } from "../history-tree-view/data-provider";
import { ScriptScriptItem } from "../scripts-tree-view/script-item";
import { showErrorMessage } from "../util/show-message";

export const registerScriptShowHistoryCommand = (
    historiesDataProvider: HistoryTreeViewDataProvider,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.script.show-history", async (
            item: ScriptScriptItem,
        ) => {

        const script: IImbricateScript | null =
            await item.origin.getScript(item.scriptSnapshot.identifier);

        if (!script) {
            showErrorMessage(`Cannot find script: ${item.scriptSnapshot.scriptName}`);
            return;
        }

        historiesDataProvider.showRecords(script.historyRecords);
    });

    return disposable;
};
