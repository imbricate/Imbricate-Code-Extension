/**
 * @author WMXPY
 * @namespace Command
 * @description Script Copy Trace
 */

import * as vscode from "vscode";
import { ScriptScriptItem } from "../scripts-tree-view/script-item";

export const registerScriptCopyTraceCommand = (): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.script.copy.trace", async (
            item: ScriptScriptItem,
        ) => {

        const trace: string = [
            item.originName,
            item.scriptSnapshot.identifier,
        ].join(":");

        await vscode.env.clipboard.writeText(
            trace,
        );
    });

    return disposable;
};
