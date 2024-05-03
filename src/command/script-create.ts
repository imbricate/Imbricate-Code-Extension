/**
 * @author WMXPY
 * @namespace Command
 * @description Script Create
 */

import { IImbricateOrigin, IImbricateScript } from "@imbricate/core";
import { ActiveEditing, ImbricateOriginManager, createScriptSavingTarget, establishImbricateSavingTarget, validateFilename } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { EditingTreeViewDataProvider } from "../editing-tree-view/data-provider";
import { ScriptsTreeViewDataProvider } from "../scripts-tree-view/data-provider";
import { ScriptsOriginItem } from "../scripts-tree-view/origin-item";
import { showErrorMessage } from "../util/show-message";

export const registerScriptCreateCommand = (
    editingsDataProvider: EditingTreeViewDataProvider,
    scriptsDataProvider: ScriptsTreeViewDataProvider,
    originManager: ImbricateOriginManager,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand("imbricate.script.create", async (item?: ScriptsOriginItem) => {

        let originName: string | null = null;
        let origin: IImbricateOrigin | null = null;
        if (typeof item === "undefined") {

            const targetOriginName: string | undefined = await vscode.window.showInputBox({
                title: "Create Script",
                prompt: "Origin Name...",
            });

            if (!targetOriginName) {
                return;
            }

            originName = targetOriginName;
            const targetOrigin = originManager.getOrigin(targetOriginName);

            if (!targetOrigin) {
                showErrorMessage(`Cannot find origin: ${targetOriginName}`);
                return;
            }

            origin = targetOrigin;
        } else {

            originName = item.originName;
            origin = item.origin;
        }

        if (!originName) {
            showErrorMessage("Cannot find origin name");
            return;
        }

        if (!origin) {
            showErrorMessage("Cannot find origin");
            return;
        }

        const scriptTitle: string | undefined = await vscode.window.showInputBox({
            title: "Create Script",
            prompt: "Script Title...",
            validateInput: (value: string) => {

                if (validateFilename(value)) {
                    return "Script title should not be empty";
                }

                return undefined;
            },
        });

        if (!scriptTitle) {
            return;
        }

        const initialScript: string = "";

        const script: IImbricateScript = await origin.createScript(
            scriptTitle,
            initialScript,
        );

        const savingTarget = createScriptSavingTarget(
            originName,
            script.identifier,
        );

        const activeEditing: ActiveEditing = await establishImbricateSavingTarget(
            savingTarget,
            `${script.scriptName}.js`,
            initialScript,
        );

        const textDocument: vscode.TextDocument =
            await vscode.workspace.openTextDocument(activeEditing.path);

        await vscode.window.showTextDocument(textDocument);

        scriptsDataProvider.refresh();
        editingsDataProvider.refresh();
    });

    return disposable;
};
