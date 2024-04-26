/**
 * @author WMXPY
 * @namespace Command
 * @description Page Delete
 */

import { IImbricatePage } from "@imbricate/core";
import { ActiveEditing, createPageSavingTarget, establishImbricateSavingTarget } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { EditingTreeViewDataProvider } from "../editing-tree-view/data-provider";
import { PagePageItem } from "../pages-tree-view/page-item";
import { showErrorMessage } from "../util/show-message";

export const registerPageDeleteCommand = (
    editingsDataProvider: EditingTreeViewDataProvider,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand("imbricate.page.delete", async (item: PagePageItem) => {

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

        const deleted = await item.collection.deletePage(item.pageSnapshot.identifier);

        const content: string = await page.readContent();

        const activeEditing: ActiveEditing = await establishImbricateSavingTarget(
            savingTarget,
            `${item.pageSnapshot.title}.md`,
            content,
        );

        const textDocument: vscode.TextDocument =
            await vscode.workspace.openTextDocument(activeEditing.path);

        await vscode.window.showTextDocument(textDocument);

        editingsDataProvider.refresh();
    });

    return disposable;
};
