/**
 * @author WMXPY
 * @namespace Command
 * @description Editing Perform
 */

import { ActiveEditing, ImbricateOriginManager, getActiveEditingReference, performImbricateSavingTarget } from "@imbricate/local-fundamental";
import { readTextFile } from "@sudoo/io";
import * as vscode from "vscode";
import { EditingTreeViewDataProvider } from "../editing-tree-view/data-provider";
import { showInformationMessage } from "../util/show-message";
import { EditingEditingItem } from "../editing-tree-view/editing-item";

export const registerEditingPerformCommand = (
    originManager: ImbricateOriginManager,
    editingDataProvider: EditingTreeViewDataProvider,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand("imbricate.editing.perform", async (item: EditingEditingItem) => {

        const activeEditing: ActiveEditing = item.activeEditing;

        const reference: string = getActiveEditingReference(activeEditing);

        const updateContent: string = await readTextFile(activeEditing.path);

        await performImbricateSavingTarget(
            activeEditing.target,
            updateContent,
            originManager,
        );

        showInformationMessage(`Perform Editing: ${reference}`);

        editingDataProvider.refresh();
    });

    return disposable;
};
