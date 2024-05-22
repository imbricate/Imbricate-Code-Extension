/**
 * @author WMXPY
 * @namespace Command
 * @description Script Edit
 */

import { IImbricateScript } from "@imbricate/core";
import { ActiveEditing, createScriptSavingTarget, establishImbricateSavingTarget } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { EditingTreeViewDataProvider } from "../editing-tree-view/data-provider";
import { ScriptScriptItem } from "../scripts-tree-view/script-item";
import { showErrorMessage } from "../util/show-message";

export const registerScriptEditCommand = (
    editingsDataProvider: EditingTreeViewDataProvider,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.script.edit", async (
            item: ScriptScriptItem,
        ) => {

        const savingTarget = createScriptSavingTarget(
            item.originName,
            item.scriptSnapshot.identifier,
        );

        const script: IImbricateScript | null =
            await item.origin.getScript(item.scriptSnapshot.identifier);

        if (!script) {
            showErrorMessage(`Cannot find script: ${item.scriptSnapshot.scriptName}`);
            return;
        }

        const content: string = await script.readScript();

        const activeEditing: ActiveEditing = await establishImbricateSavingTarget(
            savingTarget,
            `${item.scriptSnapshot.scriptName}.js`,
            content,
        );

        const textDocument: vscode.TextDocument =
            await vscode.workspace.openTextDocument(activeEditing.path);

        await vscode.window.showTextDocument(textDocument);

        editingsDataProvider.refresh();
    });

    return disposable;
};
