/**
 * @author WMXPY
 * @namespace Command
 * @description Script Edit
 */

import { IImbricateOrigin, IImbricateScript } from "@imbricate/core";
import { ActiveEditing, ImbricateOriginManager, createScriptSavingTarget, establishImbricateSavingTarget } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { EditingTreeViewDataProvider } from "../editing-tree-view/data-provider";
import { ScriptsTreeViewDataProvider } from "../scripts-tree-view/data-provider";
import { showErrorMessage } from "../util/show-message";
import { divideScriptMarkdownUrl } from "../virtual-document/script-javascript/concat";

export const registerScriptEditEditorCommand = (
    editingsDataProvider: EditingTreeViewDataProvider,
    _scriptsDataProvider: ScriptsTreeViewDataProvider,
    originManager: ImbricateOriginManager,
    _context: vscode.ExtensionContext,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.script.edit-editor", async (
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
            await origin
                .getScriptManager()
                .getScript(identifier);

        if (!script) {
            showErrorMessage(`Cannot find script: ${identifier}`);
            return;
        }

        const savingTarget = createScriptSavingTarget(
            originName,
            identifier,
        );

        const content: string = await script.readScript();

        const activeEditing: ActiveEditing = await establishImbricateSavingTarget(
            savingTarget,
            `${script.scriptName}.js`,
            content,
        );

        const textDocument: vscode.TextDocument =
            await vscode.workspace.openTextDocument(activeEditing.path);

        await vscode.window.showTextDocument(textDocument);

        editingsDataProvider.refresh();
    });

    return disposable;
};
