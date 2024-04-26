/**
 * @author WMXPY
 * @namespace Command
 * @description Editing Perform
 */

import { ActiveEditing, ImbricateOriginManager, performImbricateSavingTarget, readActiveEditing } from "@imbricate/local-fundamental";
import { readTextFile } from "@sudoo/io";
import * as vscode from "vscode";
import { EditingTreeViewDataProvider } from "../editing-tree-view/data-provider";
import { concatSavingTargetUrl } from "../virtual-document/concat-target";
import { onChangeEmitter } from "../virtual-document/on-change-emitter";

export const registerEditingPerformAllCommand = (
    originManager: ImbricateOriginManager,
    editingDataProvider: EditingTreeViewDataProvider,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand("imbricate.editings.perform-all", async () => {

        const activeEditings: ActiveEditing[] = await readActiveEditing();

        for (const activeEditing of activeEditings) {

            const updateContent: string = await readTextFile(activeEditing.path);

            await performImbricateSavingTarget(
                activeEditing.target,
                updateContent,
                originManager,
            );

            const url = concatSavingTargetUrl(activeEditing.target);

            onChangeEmitter.fire(url);
        }

        editingDataProvider.refresh();
    });

    return disposable;
};
