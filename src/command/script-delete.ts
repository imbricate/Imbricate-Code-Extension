/**
 * @author WMXPY
 * @namespace Command
 * @description Script Delete
 */

import { checkSavingTargetActive, createScriptSavingTarget } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { EditingTreeViewDataProvider } from "../editing-tree-view/data-provider";
import { ScriptScriptItem } from "../scripts-tree-view/script-item";
import { showErrorMessage } from "../util/show-message";

export const registerScriptDeleteCommand = (
    editingsDataProvider: EditingTreeViewDataProvider,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand("imbricate.script.delete", async (item: ScriptScriptItem) => {

        const savingTarget = createScriptSavingTarget(
            item.originName,
            item.scriptSnapshot.identifier,
        );

        const isActive: boolean = await checkSavingTargetActive(savingTarget);

        if (isActive) {
            showErrorMessage(`Script is currently editing: ${item.scriptSnapshot.scriptName}`);
            return;
        }

        await item.origin.deleteScript(item.scriptSnapshot.identifier);

        editingsDataProvider.refresh();
    });

    return disposable;
};
