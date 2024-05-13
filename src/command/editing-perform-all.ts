/**
 * @author WMXPY
 * @namespace Command
 * @description Editing Perform
 */

import { ActiveEditing, ImbricateOriginManager, digestString, performImbricateSavingTarget, readActiveEditing, retrieveImbricateSavingTarget } from "@imbricate/local-fundamental";
import { readTextFile } from "@sudoo/io";
import * as vscode from "vscode";
import { EditingTreeViewDataProvider } from "../editing-tree-view/data-provider";
import { closeEditor } from "../util/close-editor";
import { compareFilePath } from "../util/path";
import { showInformationMessage } from "../util/show-message";
import { concatSavingTargetUrl } from "../virtual-document/concat-target";
import { concatEditingOriginalUrl } from "../virtual-document/editing-original/concat";
import { editingOnChangeEmitter, onChangeEmitter } from "../virtual-document/on-change-emitter";

export const registerEditingPerformAllCommand = (
    originManager: ImbricateOriginManager,
    editingDataProvider: EditingTreeViewDataProvider,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand("imbricate.editings.perform-all", async () => {

        const activeEditings: ActiveEditing[] = await readActiveEditing();

        const unmodified: ActiveEditing[] = [];
        for (const activeEditing of activeEditings) {

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
                unmodified.push(activeEditing);
            }

            const url = concatSavingTargetUrl(activeEditing.target);
            onChangeEmitter.fire(url);

            const editingUrl = concatEditingOriginalUrl(activeEditing.identifier);
            editingOnChangeEmitter.fire(editingUrl);
        }

        if (unmodified.length > 0) {
            showInformationMessage(`Documents ${unmodified.map((each: ActiveEditing) => each.hash).join(", ")} have not been modified`);
        }

        editingDataProvider.refresh();

        for (const visibleEditor of vscode.window.visibleTextEditors) {

            const included: boolean = activeEditings.some((
                each: ActiveEditing,
            ) => {
                return compareFilePath(
                    visibleEditor.document.uri.fsPath,
                    each.path,
                );
            });

            if (included) {

                closeEditor(visibleEditor);
            }
        }
    });

    return disposable;
};
