/**
 * @author WMXPY
 * @namespace Command
 * @description Page Edit Editor
 */

import { IImbricateCollection, IImbricateOrigin, IImbricatePage } from "@imbricate/core";
import { ActiveEditing, ImbricateOriginManager, createPageSavingTarget, establishImbricateSavingTarget } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { EditingTreeViewDataProvider } from "../editing-tree-view/data-provider";
import { PagesTreeViewDataProvider } from "../pages-tree-view/data-provider";
import { PagePersistanceData } from "../pages-tree-view/page-data";
import { recordRecentPage } from "../util/recent";
import { showErrorMessage } from "../util/show-message";
import { dividePageMarkdownUrl } from "../virtual-document/page-markdown/concat";

export const registerPageEditEditorCommand = (
    editingsDataProvider: EditingTreeViewDataProvider,
    pagesDataProvider: PagesTreeViewDataProvider,
    originManager: ImbricateOriginManager,
    context: vscode.ExtensionContext,
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

        const collection: IImbricateCollection | null =
            await origin
                .getCollectionManager()
                .getCollection(collectionUniqueIdentifier);

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

        const persistanceData: PagePersistanceData = {
            originName,
            collectionUniqueIdentifier,
            pageSnapshot: {
                directories: page.directories,
                title: page.title,
                identifier: page.identifier,
            },
        };

        await recordRecentPage(
            persistanceData,
            pagesDataProvider,
            context,
        );

        editingsDataProvider.refresh();
    });

    return disposable;
};
