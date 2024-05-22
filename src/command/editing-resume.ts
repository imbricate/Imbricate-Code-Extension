/**
 * @author WMXPY
 * @namespace Command
 * @description Editing Resume
 */

import { ActiveEditing } from "@imbricate/local-fundamental";
import * as vscode from "vscode";

export const registerEditingResumeCommand = (): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.editing.resume", async (
            activeEditing: ActiveEditing,
        ) => {

        const textDocument: vscode.TextDocument =
            await vscode.workspace.openTextDocument(activeEditing.path);

        await vscode.window.showTextDocument(textDocument);
    });

    return disposable;
};
