/**
 * @author WMXPY
 * @namespace Command
 * @description Script Execute
 */

import { IImbricateScript } from "@imbricate/core";
import * as vscode from "vscode";
import { executeImbricateScript } from "../execute/execute";
import { ScriptScriptItem } from "../scripts-tree-view/script-item";
import { showErrorMessage } from "../util/show-message";

export const registerScriptExecuteCommand = (): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.script.execute", async (
            item: ScriptScriptItem,
        ) => {

        const script: IImbricateScript | null =
            await item.origin.getScript(item.scriptSnapshot.identifier);

        if (!script) {
            showErrorMessage(`Cannot find script: ${item.scriptSnapshot.scriptName}`);
            return;
        }

        await executeImbricateScript(
            item.origin,
            script,
        );
    });

    return disposable;
};
