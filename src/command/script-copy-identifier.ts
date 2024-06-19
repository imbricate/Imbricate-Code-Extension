/**
 * @author WMXPY
 * @namespace Command
 * @description Script Copy Identifier
 */

import * as vscode from "vscode";
import { ScriptScriptItem } from "../scripts-tree-view/script-item";

export const registerScriptCopyIdentifierCommand = (): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.script.copy.identifier", async (
            item: ScriptScriptItem,
        ) => {

        await vscode.env.clipboard.writeText(
            item.scriptSnapshot.identifier,
        );
    });

    return disposable;
};
