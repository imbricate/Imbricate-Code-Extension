/**
 * @author WMXPY
 * @namespace Command
 * @description Editing Save Editor
 */

import { ActiveEditing, ImbricateOriginManager, digestString, performImbricateSavingTarget, readActiveEditing, retrieveImbricateSavingTarget } from "@imbricate/local-fundamental";
import { readTextFile } from "@sudoo/io";
import * as vscode from "vscode";
import { showErrorMessage, showInformationMessage } from "../util/show-message";
import { concatSavingTargetUrl } from "../virtual-document/concat-target";
import { concatEditingOriginalUrl } from "../virtual-document/editing-original/concat";
import { editingOnChangeEmitter, onChangeEmitter } from "../virtual-document/on-change-emitter";

export const registerEditingSaveEditorCommand = (
    originManager: ImbricateOriginManager,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.editing.save-editor", async (
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

        const originalContent = await retrieveImbricateSavingTarget(
            targetEditing.target,
            originManager,
            "[ERROR] Content Not Found!",
        );

        const originalDigest: string = digestString(originalContent);

        const isPerformed: boolean = await performImbricateSavingTarget(
            targetEditing.target,
            originalDigest,
            updateContent,
            originManager,
            {
                cancelIfNoChange: true,
                cleanup: false,
            },
        );

        if (!isPerformed) {
            showInformationMessage(`Document ${targetEditing.hash} has not been modified`);
        }

        const url = concatSavingTargetUrl(targetEditing.target);
        onChangeEmitter.fire(url);

        const editingUrl = concatEditingOriginalUrl(targetEditing.identifier);
        editingOnChangeEmitter.fire(editingUrl);
    });

    return disposable;
};
