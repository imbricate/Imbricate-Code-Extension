/**
 * @author WMXPY
 * @namespace Command
 * @description Page Favorite
 */

import * as vscode from "vscode";
import { PagesTreeViewDataProvider } from "../pages-tree-view/data-provider";
import { PAGES_FAVORITES_KEY, PagePersistanceData } from "../pages-tree-view/page-data";
import { PagePageItem } from "../pages-tree-view/page-item";

export const registerPageUnfavoriteCommand = (
    pagesDataProvider: PagesTreeViewDataProvider,
    context: vscode.ExtensionContext,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand("imbricate.page.unfavorite", async (item: PagePageItem) => {

        const persistanceData: PagePersistanceData = {
            originName: item.originName,
            collectionName: item.collection.collectionName,
            pageSnapshot: item.pageSnapshot,
        };

        const currentFavorites: PagePersistanceData[] | undefined =
            context.globalState.get(PAGES_FAVORITES_KEY);

        if (!currentFavorites) {
            return;
        }

        const newFavorites: PagePersistanceData[] = currentFavorites.filter((current: PagePersistanceData) => {
            return current.originName !== persistanceData.originName
                || current.collectionName !== persistanceData.collectionName
                || current.pageSnapshot.identifier !== persistanceData.pageSnapshot.identifier;
        });

        await context.globalState.update(
            PAGES_FAVORITES_KEY,
            newFavorites,
        );

        pagesDataProvider.refresh();
    });

    return disposable;
};
