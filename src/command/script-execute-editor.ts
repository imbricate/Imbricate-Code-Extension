/**
 * @author WMXPY
 * @namespace Command
 * @description Script Execute Editor
 */

import { IImbricateOrigin, IImbricateScript } from "@imbricate/core";
import { ImbricateOriginManager } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { executeImbricateScript } from "../execute/execute";
import { showErrorMessage } from "../util/show-message";
import { divideScriptMarkdownUrl } from "../virtual-document/script-javascript/concat";

export const registerScriptExecuteEditorCommand = (
    originManager: ImbricateOriginManager,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.script.execute-editor", async (
            uri: vscode.Uri,
        ) => {

        const [
            originName,
            identifier,
        ] = divideScriptMarkdownUrl(uri);

        const origin: IImbricateOrigin | null =
            originManager.getOrigin(originName);

        if (!origin) {
            showErrorMessage(`Cannot find origin: ${originName}`);
            return;
        }

        const script: IImbricateScript | null =
            await origin.getScript(identifier);

        if (!script) {
            showErrorMessage(`Cannot find script: ${identifier}`);
            return;
        }

        await executeImbricateScript(
            origin,
            script,
        );
    });

    return disposable;
};
