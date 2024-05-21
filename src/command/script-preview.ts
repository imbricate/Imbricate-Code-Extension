/**
 * @author WMXPY
 * @namespace Command
 * @description Script Preview
 */

import * as vscode from "vscode";
import { ScriptScriptItem } from "../scripts-tree-view/script-item";
import { concatScriptJavascriptUrl } from "../virtual-document/script-javascript/concat";

export const registerScriptPreviewCommand = (): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand("imbricate.script.preview", async (
        item: ScriptScriptItem,
    ) => {

        const uri = concatScriptJavascriptUrl(
            item.originName,
            item.scriptSnapshot.identifier,
        );

        const textDocument: vscode.TextDocument =
            await vscode.workspace.openTextDocument(uri);

        await vscode.window.showTextDocument(textDocument);
    });

    return disposable;
};
