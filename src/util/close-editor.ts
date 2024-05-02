/**
 * @author WMXPY
 * @namespace Util
 * @description Close Editor
 */

import * as vscode from "vscode";

export const closeEditor = async (editor: vscode.TextEditor): Promise<void> => {

    await vscode.window.showTextDocument(
        editor.document.uri,
        {
            preview: false,
            viewColumn: editor.viewColumn,
        });

    await vscode.commands.executeCommand("workbench.action.closeActiveEditor");

    return;
};
