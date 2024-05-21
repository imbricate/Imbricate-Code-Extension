/**
 * @author WMXPY
 * @namespace Command
 * @description Script Execute Save Editor
 */

import { ActiveEditing, ImbricateOriginManager, SAVING_TARGET_TYPE, readActiveEditing } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { showErrorMessage } from "../util/show-message";

export const registerScriptExecuteSaveEditorCommand = (
    originManager: ImbricateOriginManager,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand("imbricate.script.execute-save-editor", async (
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

        const origin = originManager.getOrigin(targetEditing.target.payload.origin);

        console.log(origin);

        // const script: IImbricateScript | null =
        //     await item.origin.getScript(item.scriptSnapshot.identifier);

        // if (!script) {
        //     showErrorMessage(`Cannot find script: ${item.scriptSnapshot.scriptName}`);
        //     return;
        // }

        // await executeImbricateScript(
        //     item.origin,
        //     script,
        // );
    });

    return disposable;
};
