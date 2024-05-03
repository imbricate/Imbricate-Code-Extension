/**
 * @author WMXPY
 * @namespace Command
 * @description Page Retitle
 */

import * as vscode from "vscode";
import { PagesTreeViewDataProvider } from "../pages-tree-view/data-provider";
import { PagePageItem } from "../pages-tree-view/page-item";
import { checkSavingTargetActive, createPageSavingTarget } from "@imbricate/local-fundamental";
import { showErrorMessage } from "../util/show-message";

export const registerPageRetitleCommand = (
    pagesDataProvider: PagesTreeViewDataProvider,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.page.retitle", async (
            pageItem: PagePageItem,
        ) => {

        const savingTarget = createPageSavingTarget(
            pageItem.originName,
            pageItem.collection.collectionName,
            pageItem.pageSnapshot.identifier,
        );

        const isActive: boolean = await checkSavingTargetActive(savingTarget);

        if (isActive) {
            showErrorMessage(`Page is currently editing: ${pageItem.pageSnapshot.title}`);
            return;
        }

        const newTitle: string | undefined = await vscode.window.showInputBox({
            title: "Retitle Page",
            prompt: `Retitling Page ${pageItem.pageSnapshot.title}...`,
            placeHolder: "New Page Title...",
        });

        if (!newTitle) {
            return;
        }

        await pageItem.collection.retitlePage(
            pageItem.pageSnapshot.identifier,
            newTitle,
        );

        pagesDataProvider.refresh();
    });

    return disposable;
};
