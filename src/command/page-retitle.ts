/**
 * @author WMXPY
 * @namespace Command
 * @description Page Retitle
 */

import { checkSavingTargetActive, createPageSavingTarget } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { PagesTreeViewDataProvider } from "../pages-tree-view/data-provider";
import { PAGES_FAVORITES_KEY, PagePersistanceData } from "../pages-tree-view/page-data";
import { PagePageItem } from "../pages-tree-view/page-item";
import { showErrorMessage } from "../util/show-message";

export const registerPageRetitleCommand = (
    pagesDataProvider: PagesTreeViewDataProvider,
    context: vscode.ExtensionContext,
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


        const currentFavorites: PagePersistanceData[] | undefined =
            context.globalState.get(PAGES_FAVORITES_KEY);

        if (Array.isArray(currentFavorites)) {

            const newFavorites: PagePersistanceData[] = currentFavorites.map((current: PagePersistanceData) => {

                if (current.originName === pageItem.originName
                    && current.collectionName === pageItem.collection.collectionName
                    && current.pageSnapshot.identifier === pageItem.pageSnapshot.identifier) {

                    return {
                        ...current,
                        pageSnapshot: {
                            ...current.pageSnapshot,
                            title: newTitle,
                        },
                    };
                }
                return current;
            });


            await context.globalState.update(
                PAGES_FAVORITES_KEY,
                newFavorites,
            );
        }

        pagesDataProvider.refresh();
    });

    return disposable;
};
