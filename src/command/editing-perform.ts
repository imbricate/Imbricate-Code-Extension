/**
 * @author WMXPY
 * @namespace Command
 * @description Editing Perform
 */

import { ActiveEditing, ImbricateOriginManager, digestString, performImbricateSavingTarget, retrieveImbricateSavingTarget } from "@imbricate/local-fundamental";
import { readTextFile } from "@sudoo/io";
import * as vscode from "vscode";
import { EditingTreeViewDataProvider } from "../editing-tree-view/data-provider";
import { EditingEditingItem } from "../editing-tree-view/editing-item";
import { closeEditor } from "../util/close-editor";
import { compareFilePath } from "../util/path";
import { showInformationMessage } from "../util/show-message";
import { concatSavingTargetUrl } from "../virtual-document/concat-target";
import { concatEditingOriginalUrl } from "../virtual-document/editing-original/concat";
import { editingOnChangeEmitter, onChangeEmitter } from "../virtual-document/on-change-emitter";

export const registerEditingPerformCommand = (
    originManager: ImbricateOriginManager,
    editingDataProvider: EditingTreeViewDataProvider,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.editing.perform", async (
            item: EditingEditingItem,
        ) => {

        const activeEditing: ActiveEditing = item.activeEditing;

        const updateContent: string = await readTextFile(activeEditing.path);

        const originalContent = await retrieveImbricateSavingTarget(
            activeEditing.target,
            originManager,
            "[ERROR] Content Not Found!",
        );

        const originalDigest: string = digestString(originalContent);

        const isPerformed: boolean = await performImbricateSavingTarget(
            activeEditing.target,
            originalDigest,
            updateContent,
            originManager,
        );

        if (!isPerformed) {
            showInformationMessage(`Document ${activeEditing.hash} has not been modified`);
        }

        editingDataProvider.refresh();

        const url = concatSavingTargetUrl(activeEditing.target);
        onChangeEmitter.fire(url);

        const editingUrl = concatEditingOriginalUrl(activeEditing.identifier);
        editingOnChangeEmitter.fire(editingUrl);

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
