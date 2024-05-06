/**
 * @author WMXPY
 * @namespace Command
 * @description Page Edit Editor
 */

import { IImbricateOrigin, IImbricateOriginCollection, IImbricatePage } from "@imbricate/core";
import { ActiveEditing, ImbricateOriginManager, createPageSavingTarget, establishImbricateSavingTarget } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { EditingTreeViewDataProvider } from "../editing-tree-view/data-provider";
import { showErrorMessage } from "../util/show-message";
import { dividePageMarkdownUrl } from "../virtual-document/page-markdown/concat";

export const registerPageEditEditorCommand = (
    editingsDataProvider: EditingTreeViewDataProvider,
    originManager: ImbricateOriginManager,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.page.edit-editor", async (
            uri: vscode.Uri,
        ) => {

        const [
            originName,
            collectionUniqueIdentifier,
            pageIdentifier,
        ] = dividePageMarkdownUrl(uri);

        const origin: IImbricateOrigin | null =
            originManager.getOrigin(originName);

        if (!origin) {
            showErrorMessage(`Cannot find origin: ${originName}`);
            return;
        }

        const collection: IImbricateOriginCollection | null =
            await origin.getCollection(collectionUniqueIdentifier);

        if (!collection) {
            showErrorMessage(`Cannot find collection: ${collectionUniqueIdentifier}`);
            return;
        }

        const page: IImbricatePage | null =
            await collection.getPage(pageIdentifier);

        if (!page) {
            showErrorMessage(`Cannot find page: ${pageIdentifier}`);
            return;
        }

        const savingTarget = createPageSavingTarget(
            originName,
            collectionUniqueIdentifier,
            pageIdentifier,
        );

        const content: string = await page.readContent();

        const activeEditing: ActiveEditing = await establishImbricateSavingTarget(
            savingTarget,
            `${page.title}.md`,
            content,
        );

        const textDocument: vscode.TextDocument =
            await vscode.workspace.openTextDocument(activeEditing.path);

        await vscode.window.showTextDocument(textDocument);

        editingsDataProvider.refresh();
    });

    return disposable;
};
