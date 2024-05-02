/**
 * @author WMXPY
 * @namespace Command
 * @description Editing Perform Editor
 */

import { ActiveEditing, ImbricateOriginManager, performImbricateSavingTarget, readActiveEditing } from "@imbricate/local-fundamental";
import { readTextFile } from "@sudoo/io";
import * as vscode from "vscode";
import { EditingTreeViewDataProvider } from "../editing-tree-view/data-provider";
import { closeEditor } from "../util/close-editor";
import { showErrorMessage, showInformationMessage } from "../util/show-message";
import { concatSavingTargetUrl } from "../virtual-document/concat-target";
import { onChangeEmitter } from "../virtual-document/on-change-emitter";

export const registerEditingPerformEditorCommand = (
    originManager: ImbricateOriginManager,
    editingDataProvider: EditingTreeViewDataProvider,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.editing.perform-editor", async (
            item: vscode.Uri,
        ) => {

        const activeEditings: ActiveEditing[] = await readActiveEditing();

        const identifierList = item.path.match(/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/);

        if (!identifierList) {
            return;
        }

        const identifier: string | undefined = identifierList[0];

        if (!identifier) {
            return;
        }

        const targetEditing: ActiveEditing | undefined =
            activeEditings.find((activeEditing: ActiveEditing) => {
                return activeEditing.identifier === identifier;
            });

        if (!targetEditing) {
            showErrorMessage("Cannot find target editing");
            return;
        }

        const updateContent: string = await readTextFile(targetEditing.path);

        const isPerformed: boolean = await performImbricateSavingTarget(
            targetEditing.target,
            updateContent,
            originManager,
        );

        if (!isPerformed) {
            showInformationMessage(`Document ${targetEditing.hash} has not been modified`);
        }

        editingDataProvider.refresh();

        const url = concatSavingTargetUrl(targetEditing.target);

        onChangeEmitter.fire(url);

        for (const visibleEditor of vscode.window.visibleTextEditors) {
            if (visibleEditor.document.uri.path === targetEditing.path) {

                closeEditor(visibleEditor);
            }
        }
    });

    return disposable;
};
