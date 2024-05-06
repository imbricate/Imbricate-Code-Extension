/**
 * @author WMXPY
 * @namespace Command
 * @description Page Favorite
 */

import * as vscode from "vscode";
import { PagesTreeViewDataProvider } from "../pages-tree-view/data-provider";
import { PAGES_FAVORITES_KEY, PagePersistanceData } from "../pages-tree-view/page-data";
import { PagePageItem } from "../pages-tree-view/page-item";
import { showInformationMessage } from "../util/show-message";

export const registerPageFavoriteCommand = (
    pagesDataProvider: PagesTreeViewDataProvider,
    context: vscode.ExtensionContext,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.page.favorite", async (
            pageItem: PagePageItem,
        ) => {

        const persistanceData: PagePersistanceData = {
            originName: pageItem.originName,
            collectionUniqueIdentifier: pageItem.collection.uniqueIdentifier,
            pageSnapshot: pageItem.pageSnapshot,
        };

        const currentFavorites: PagePersistanceData[] | undefined =
            context.globalState.get(PAGES_FAVORITES_KEY);

        if (!currentFavorites) {
            context.globalState.update(
                PAGES_FAVORITES_KEY,
                [persistanceData],
            );
            return;
        }

        for (const current of currentFavorites) {

            if (current.originName === persistanceData.originName
                && current.collectionUniqueIdentifier === persistanceData.collectionUniqueIdentifier
                && current.pageSnapshot.identifier === persistanceData.pageSnapshot.identifier) {

                showInformationMessage("Already favorited");

                return;
            }
        }

        const newFavorites: PagePersistanceData[] = [
            ...currentFavorites,
            persistanceData,
        ];

        await context.globalState.update(
            PAGES_FAVORITES_KEY,
            newFavorites,
        );

        pagesDataProvider.refresh();
    });

    return disposable;
};
