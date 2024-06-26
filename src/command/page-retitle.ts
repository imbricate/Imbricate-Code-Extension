/**
 * @author WMXPY
 * @namespace Command
 * @description Page Retitle
 */

import { checkSavingTargetActive, createPageSavingTarget, validateFilename } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { PagesTreeViewDataProvider } from "../pages-tree-view/data-provider";
import { PAGES_FAVORITES_KEY, PAGES_RECENTS_KEY, PagePersistanceData } from "../pages-tree-view/page-data";
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
            pageItem.collection.uniqueIdentifier,
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
            value: pageItem.pageSnapshot.title,
            valueSelection: [0, pageItem.pageSnapshot.title.length],
            validateInput: (value: string) => {

                if (value === pageItem.pageSnapshot.title) {
                    return "New page title should not be the same as the old one";
                }

                const validateResult: string | null = validateFilename(value);
                if (typeof validateResult === "string") {
                    return validateResult;
                }
                return undefined;
            },
            placeHolder: "New Page Title...",
        });

        if (!newTitle) {
            return;
        }

        const alreadyExist: boolean = await pageItem.collection.hasPage(
            pageItem.pageSnapshot.directories,
            newTitle,
        );

        if (alreadyExist) {
            showErrorMessage("Page Already Exist");
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
                    && current.collectionUniqueIdentifier === pageItem.collection.uniqueIdentifier
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

        const currentRecents: PagePersistanceData[] | undefined =
            context.globalState.get(PAGES_RECENTS_KEY);

        if (Array.isArray(currentRecents)) {

            const newRecents: PagePersistanceData[] = currentRecents.map((current: PagePersistanceData) => {

                if (current.originName === pageItem.originName
                    && current.collectionUniqueIdentifier === pageItem.collection.uniqueIdentifier
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
                PAGES_RECENTS_KEY,
                newRecents,
            );
        }

        pagesDataProvider.refresh();
    });

    return disposable;
};
