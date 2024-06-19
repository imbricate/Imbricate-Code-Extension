/**
 * @author WMXPY
 * @namespace Command
 * @description Script Copy Reference
 */

import * as vscode from "vscode";
import { ScriptScriptItem } from "../scripts-tree-view/script-item";

export const registerScriptCopyTraceCommand = (): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.script.copy.reference", async (
            item: ScriptScriptItem,
        ) => {

        const trace: string = [
            item.originName,
            item.scriptSnapshot.identifier,
        ].join(":");

        const reference: string = `_$${trace}_`;

        await vscode.env.clipboard.writeText(
            reference,
        );
    });

    return disposable;
};
