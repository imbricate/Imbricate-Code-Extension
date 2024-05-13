/**
 * @author WMXPY
 * @namespace Command
 * @description Page Delete
 */

import { checkSavingTargetActive, createPageSavingTarget } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { PagesTreeViewDataProvider } from "../pages-tree-view/data-provider";
import { PAGES_FAVORITES_KEY, PAGES_RECENTS_KEY, PagePersistanceData } from "../pages-tree-view/page-data";
import { PagePageItem } from "../pages-tree-view/page-item";
import { showErrorMessage } from "../util/show-message";

export const registerPageDeleteCommand = (
    pagesDataProvider: PagesTreeViewDataProvider,
    context: vscode.ExtensionContext,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand("imbricate.page.delete", async (item: PagePageItem) => {

        const result: vscode.MessageItem | undefined = await vscode.window.showInformationMessage(
            `Deleting page\n[${item.pageSnapshot.title}]`,
            {
                modal: true,
            },
            {
                title: "Delete",
            },
        );

        if (!result) {
            return;
        }

        if (result.title !== "Delete") {
            return;
        }

        const savingTarget = createPageSavingTarget(
            item.originName,
            item.collection.uniqueIdentifier,
            item.pageSnapshot.identifier,
        );

        const isActive: boolean = await checkSavingTargetActive(savingTarget);

        if (isActive) {
            showErrorMessage(`Page is currently editing: ${item.pageSnapshot.title}`);
            return;
        }

        const persistanceData: PagePersistanceData = {
            originName: item.originName,
            collectionUniqueIdentifier: item.collection.uniqueIdentifier,
            pageSnapshot: item.pageSnapshot,
        };

        await item.collection.deletePage(item.pageSnapshot.identifier);

        const currentFavorites: PagePersistanceData[] | undefined =
            context.globalState.get(PAGES_FAVORITES_KEY);

        if (currentFavorites) {

            const newFavorites: PagePersistanceData[] = currentFavorites.filter((current: PagePersistanceData) => {
                return current.originName !== persistanceData.originName
                    || current.collectionUniqueIdentifier !== persistanceData.collectionUniqueIdentifier
                    || current.pageSnapshot.identifier !== persistanceData.pageSnapshot.identifier;
            });

            await context.globalState.update(
                PAGES_FAVORITES_KEY,
                newFavorites,
            );
        }

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
