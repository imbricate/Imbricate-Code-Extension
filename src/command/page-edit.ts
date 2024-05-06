/**
 * @author WMXPY
 * @namespace Command
 * @description Page Edit
 */

import { IImbricatePage } from "@imbricate/core";
import { ActiveEditing, createPageSavingTarget, establishImbricateSavingTarget } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { EditingTreeViewDataProvider } from "../editing-tree-view/data-provider";
import { PagesTreeViewDataProvider } from "../pages-tree-view/data-provider";
import { PagePersistanceData } from "../pages-tree-view/page-data";
import { PagePageItem } from "../pages-tree-view/page-item";
import { recordRecentPage } from "../util/recent";
import { showErrorMessage } from "../util/show-message";

export const registerPageEditCommand = (
    editingsDataProvider: EditingTreeViewDataProvider,
    pageDataProvider: PagesTreeViewDataProvider,
    context: vscode.ExtensionContext,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand("imbricate.page.edit", async (item: PagePageItem) => {

        const savingTarget = createPageSavingTarget(
            item.originName,
            item.collection.collectionName,
            item.pageSnapshot.identifier,
        );

        const page: IImbricatePage | null =
            await item.collection.getPage(item.pageSnapshot.identifier);

        if (!page) {
            showErrorMessage(`Cannot find page: ${item.pageSnapshot.title}`);
            return;
        }

        const content: string = await page.readContent();

        const activeEditing: ActiveEditing = await establishImbricateSavingTarget(
            savingTarget,
            `${item.pageSnapshot.title}.md`,
            content,
        );

        const textDocument: vscode.TextDocument =
            await vscode.workspace.openTextDocument(activeEditing.path);

        await vscode.window.showTextDocument(textDocument);

        const persistanceData: PagePersistanceData = {
            originName: item.originName,
            collectionUniqueIdentifier: item.collection.uniqueIdentifier,
            pageSnapshot: item.pageSnapshot,
        };

        await recordRecentPage(
            persistanceData,
            pageDataProvider,
            context,
        );

        editingsDataProvider.refresh();
    });

    return disposable;
};
