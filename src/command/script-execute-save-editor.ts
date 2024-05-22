/**
 * @author WMXPY
 * @namespace Command
 * @description Script Execute Save Editor
 */

import { IImbricateOrigin, IImbricateScript } from "@imbricate/core";
import { ActiveEditing, ImbricateOriginManager, SAVING_TARGET_TYPE, digestString, performImbricateSavingTarget, readActiveEditing } from "@imbricate/local-fundamental";
import { readTextFile } from "@sudoo/io";
import * as vscode from "vscode";
import { executeImbricateScript } from "../execute/execute";
import { showErrorMessage, showInformationMessage } from "../util/show-message";
import { concatSavingTargetUrl } from "../virtual-document/concat-target";
import { concatEditingOriginalUrl } from "../virtual-document/editing-original/concat";
import { editingOnChangeEmitter, onChangeEmitter } from "../virtual-document/on-change-emitter";

export const registerScriptExecuteSaveEditorCommand = (
    originManager: ImbricateOriginManager,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.script.execute-save-editor", async (
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

        if (targetEditing.target.type !== SAVING_TARGET_TYPE.SCRIPT) {
            showErrorMessage("Target is not a script");
            return;
        }

        const origin: IImbricateOrigin | null = originManager.getOrigin(targetEditing.target.payload.origin);

        if (!origin) {
            showErrorMessage(`Cannot find origin: ${targetEditing.target.payload.origin}`);
            return;
        }

        const script: IImbricateScript | null =
            await origin.getScript(targetEditing.target.payload.identifier);

        if (!script) {
            showErrorMessage(`Cannot find script: ${targetEditing.target.payload.identifier}`);
            return;
        }

        const updateContent: string = await readTextFile(targetEditing.path);
        const originalContent: string = await script.readScript();

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

        await executeImbricateScript(
            origin,
            script,
        );
    });

    return disposable;
};
