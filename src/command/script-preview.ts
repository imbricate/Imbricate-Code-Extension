/**
 * @author WMXPY
 * @namespace Command
 * @description Script Preview
 */

import * as vscode from "vscode";
import { ScriptScriptItem } from "../scripts-tree-view/script-item";

export const registerScriptPreviewCommand = (): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand("imbricate.script.preview", async (item: ScriptScriptItem) => {

        const uri = vscode.Uri.parse(`imbricate-script-javascript:${item.originName}/${item.scriptSnapshot.identifier}/[READONLY] ${item.scriptSnapshot.scriptName}.js`);

        const textDocument: vscode.TextDocument =
            await vscode.workspace.openTextDocument(uri);

        await vscode.window.showTextDocument(textDocument);
    });

    return disposable;
};
