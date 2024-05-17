/**
 * @author WMXPY
 * @namespace Command
 * @description Editing Discard
 */

import { ActiveEditing, cleanupImbricateSavingTarget } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { EditingTreeViewDataProvider } from "../editing-tree-view/data-provider";
import { EditingEditingItem } from "../editing-tree-view/editing-item";
import { closeEditor } from "../util/close-editor";
import { compareFilePath } from "../util/path";
import { showErrorMessage } from "../util/show-message";

export const registerEditingDiscardCommand = (
    editingDataProvider: EditingTreeViewDataProvider,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.editing.discard", async (
            item: EditingEditingItem,
        ) => {

        const activeEditing: ActiveEditing = item.activeEditing;

        const isDiscarded: boolean = await cleanupImbricateSavingTarget(
            activeEditing.target,
        );

        if (!isDiscarded) {
            showErrorMessage(`Document ${activeEditing.hash} is not discarded`);
        }

        editingDataProvider.refresh();

        for (const visibleEditor of vscode.window.visibleTextEditors) {

            if (compareFilePath(
                visibleEditor.document.uri.fsPath,
                activeEditing.path,
            )) {

                closeEditor(visibleEditor);
            }
        }
    });

    return disposable;
};
