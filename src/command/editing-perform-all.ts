/**
 * @author WMXPY
 * @namespace Command
 * @description Editing Perform
 */

import { ActiveEditing, ImbricateOriginManager, performImbricateSavingTarget, readActiveEditing } from "@imbricate/local-fundamental";
import { readTextFile } from "@sudoo/io";
import * as vscode from "vscode";
import { EditingTreeViewDataProvider } from "../editing-tree-view/data-provider";
import { showInformationMessage } from "../util/show-message";
import { concatSavingTargetUrl } from "../virtual-document/concat-target";
import { onChangeEmitter } from "../virtual-document/on-change-emitter";

export const registerEditingPerformAllCommand = (
    originManager: ImbricateOriginManager,
    editingDataProvider: EditingTreeViewDataProvider,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand("imbricate.editings.perform-all", async () => {

        const activeEditings: ActiveEditing[] = await readActiveEditing();

        const unmodified: ActiveEditing[] = [];
        for (const activeEditing of activeEditings) {

            const updateContent: string = await readTextFile(activeEditing.path);

            const isPerformed: boolean = await performImbricateSavingTarget(
                activeEditing.target,
                updateContent,
                originManager,
            );

            if (!isPerformed) {
                unmodified.push(activeEditing);
            }

            const url = concatSavingTargetUrl(activeEditing.target);

            onChangeEmitter.fire(url);
        }

        if (unmodified.length > 0) {
            showInformationMessage(`Documents ${unmodified.map((each: ActiveEditing) => each.hash).join(", ")} have not been modified`);
        }

        editingDataProvider.refresh();
    });

    return disposable;
};
