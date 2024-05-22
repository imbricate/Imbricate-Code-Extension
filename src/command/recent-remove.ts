/**
 * @author WMXPY
 * @namespace Command
 * @description Recent Remove
 */

import * as vscode from "vscode";
import { PagesTreeViewDataProvider } from "../pages-tree-view/data-provider";
import { PAGES_RECENTS_KEY, PagePersistanceData } from "../pages-tree-view/page-data";
import { PagePageItem } from "../pages-tree-view/page-item";

export const registerPageRecentRemoveCommand = (
    pagesDataProvider: PagesTreeViewDataProvider,
    context: vscode.ExtensionContext,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.page.recent.remove", async (
            item: PagePageItem,
        ) => {

        const persistanceData: PagePersistanceData = {
            originName: item.originName,
            collectionUniqueIdentifier: item.collection.uniqueIdentifier,
            pageSnapshot: item.pageSnapshot,
        };

        const currentRecents: PagePersistanceData[] | undefined =
            context.globalState.get(PAGES_RECENTS_KEY);

        if (currentRecents) {

            const newRecents: PagePersistanceData[] = currentRecents.filter((current: PagePersistanceData) => {
                return current.originName !== persistanceData.originName
                    || current.collectionUniqueIdentifier !== persistanceData.collectionUniqueIdentifier
                    || current.pageSnapshot.identifier !== persistanceData.pageSnapshot.identifier;
            });

            await context.globalState.update(
                PAGES_RECENTS_KEY,
                newRecents,
            );
        }

        pagesDataProvider.refresh();
    });

    return disposable;
};
