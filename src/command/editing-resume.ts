/**
 * @author WMXPY
 * @namespace Command
 * @description Editing Resume
 */

import { ActiveEditing, getActiveEditingReference } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { showInformationMessage } from "../util/show-message";

export const registerEditingResumeCommand = (): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand("imbricate.editing.resume", async (activeEditing: ActiveEditing) => {

        const reference: string = getActiveEditingReference(activeEditing);

        const textDocument: vscode.TextDocument =
            await vscode.workspace.openTextDocument(activeEditing.path);

        await vscode.window.showTextDocument(textDocument);

        showInformationMessage(`Resume Editing: ${reference}`);
    });

    return disposable;
};
