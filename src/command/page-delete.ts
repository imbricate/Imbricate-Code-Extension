/**
 * @author WMXPY
 * @namespace Command
 * @description Page Delete
 */

import { checkSavingTargetActive, createPageSavingTarget } from "@imbricate/local-fundamental";
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

        const isActive: boolean = await checkSavingTargetActive(savingTarget);

        if (isActive) {
            showErrorMessage(`Page is currently editing: ${item.pageSnapshot.title}`);
            return;
        }

        await item.collection.deletePage(item.pageSnapshot.identifier);

        editingsDataProvider.refresh();
    });

    return disposable;
};
