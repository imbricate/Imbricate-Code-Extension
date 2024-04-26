/**
 * @author WMXPY
 * @namespace Command
 * @description Editing Perform
 */

import { ActiveEditing, ImbricateOriginManager, performImbricateSavingTarget } from "@imbricate/local-fundamental";
import { readTextFile } from "@sudoo/io";
import * as vscode from "vscode";
import { EditingTreeViewDataProvider } from "../editing-tree-view/data-provider";
import { EditingEditingItem } from "../editing-tree-view/editing-item";
import { showInformationMessage } from "../util/show-message";
import { concatSavingTargetUrl } from "../virtual-document/concat-target";
import { onChangeEmitter } from "../virtual-document/on-change-emitter";

export const registerEditingPerformCommand = (
    originManager: ImbricateOriginManager,
    editingDataProvider: EditingTreeViewDataProvider,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand("imbricate.editing.perform", async (item: EditingEditingItem) => {

        const activeEditing: ActiveEditing = item.activeEditing;

        const updateContent: string = await readTextFile(activeEditing.path);

        const isPerformed: boolean = await performImbricateSavingTarget(
            activeEditing.target,
            updateContent,
            originManager,
        );

        if (!isPerformed) {
            showInformationMessage(`Document ${activeEditing.hash} has not been modified`);
        }

        editingDataProvider.refresh();

        const url = concatSavingTargetUrl(activeEditing.target);

        onChangeEmitter.fire(url);
    });

    return disposable;
};
