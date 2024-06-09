/**
 * @author WMXPY
 * @namespace Command
 * @description Script Rename
 */

import { checkSavingTargetActive, createScriptSavingTarget, validateFilename } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { ScriptsTreeViewDataProvider } from "../scripts-tree-view/data-provider";
import { ScriptScriptItem } from "../scripts-tree-view/script-item";
import { showErrorMessage } from "../util/show-message";

export const registerScriptRenameCommand = (
    scriptsDataProvider: ScriptsTreeViewDataProvider,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.script.rename", async (
            item: ScriptScriptItem,
        ) => {

        const savingTarget = createScriptSavingTarget(
            item.originName,
            item.scriptSnapshot.identifier,
        );

        const isActive: boolean = await checkSavingTargetActive(savingTarget);

        if (isActive) {
            showErrorMessage(`Script is currently editing: ${item.scriptSnapshot.scriptName}`);
            return;
        }

        const newTitle: string | undefined = await vscode.window.showInputBox({
            title: "Rename Script",
            prompt: `Renaming Script ${item.scriptSnapshot.scriptName}...`,
            value: item.scriptSnapshot.scriptName,
            valueSelection: [0, item.scriptSnapshot.scriptName.length],
            validateInput: (value: string) => {

                if (value === item.scriptSnapshot.scriptName) {
                    return "New script name should not be the same as the old one";
                }

                const validateResult: string | null = validateFilename(value);
                if (typeof validateResult === "string") {
                    return validateResult;
                }
                return undefined;
            },
            placeHolder: "New Script Name...",
        });

        if (!newTitle) {
            return;
        }

        await item.origin
            .getScriptManager()
            .renameScript(
                item.scriptSnapshot.identifier,
                newTitle,
            );

        scriptsDataProvider.refresh();
    });

    return disposable;
};
