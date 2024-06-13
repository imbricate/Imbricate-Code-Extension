/**
 * @author WMXPY
 * @namespace Command
 * @description Page Move Collection
 */

import { IImbricateOrigin, IImbricatePage, ImbricatePageAttributes, ImbricatePageMetadata } from "@imbricate/core";
import { ImbricateOriginManager, checkSavingTargetActive, createPageSavingTarget } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { PagesTreeViewDataProvider } from "../pages-tree-view/data-provider";
import { PAGES_FAVORITES_KEY, PAGES_RECENTS_KEY, PagePersistanceData } from "../pages-tree-view/page-data";
import { PagePageItem } from "../pages-tree-view/page-item";
import { showErrorMessage } from "../util/show-message";

export const registerPageMoveCollectionCommand = (
    originManager: ImbricateOriginManager,
    pagesDataProvider: PagesTreeViewDataProvider,
    context: vscode.ExtensionContext,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.page.move.collection", async (
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

        const page: IImbricatePage | null =
            await pageItem.collection.getPage(pageItem.pageSnapshot.identifier);

        if (!page) {
            showErrorMessage("Cannot find page");
            return;
        }

        const collectionInitialValue: string = pageItem.collection.collectionName;

        const pageCollection: string | undefined = await vscode.window.showInputBox({
            prompt: "Target Collection Name",
            placeHolder: "Collection Name",
            value: collectionInitialValue,
            valueSelection: [0, collectionInitialValue.length],
            validateInput: (value: string) => {

                if (value.trim().length <= 0) {
                    return "Collection should not be empty";
                }

                return undefined;
            },
        });

        if (!pageCollection) {
            return;
        }

        const origin: IImbricateOrigin | null = await originManager.getOrigin(pageItem.originName);

        if (!origin) {
            showErrorMessage("Cannot find origin");
            return;
        }

        const targetCollection = await origin
            .getCollectionManager()
            .getCollection(pageCollection);

        if (!targetCollection) {
            showErrorMessage("Cannot find target collection");
            return;
        }

        const directoriesInitialValue: string = page.directories.join("/");

        const pageDirectories: string | undefined = await vscode.window.showInputBox({
            prompt: "Target Directories, split by /",
            placeHolder: "split by /",
            value: directoriesInitialValue,
            valueSelection: [0, directoriesInitialValue.length],
            validateInput: (value: string) => {

                if (value.trim().length <= 0) {
                    return "Directories should not be empty";
                }

                return undefined;
            },
        });

        if (!pageDirectories) {
            return;
        }

        const splitedDirectories: string[] =
            pageDirectories === "/"
                ? []
                : pageDirectories
                    .split("/")
                    .filter((splited: string) => splited.trim().length > 0);

        const alreadyExist: boolean = await targetCollection.hasPage(
            splitedDirectories,
            page.title,
        );

        if (alreadyExist) {
            showErrorMessage("Page Already Exist");
            return;
        }

        const attributes: ImbricatePageAttributes = await page.readAttributes();
        const metadata: ImbricatePageMetadata = {
            title: page.title,
            directories: splitedDirectories,
            identifier: page.identifier,
            createdAt: page.createdAt,
            updatedAt: page.updatedAt,
            digest: page.digest,
            attributes,
            historyRecords: page.historyRecords,
            description: page.description,
        };
        const content: string = await page.readContent();

        await pageItem.collection.deletePage(page.identifier);

        await targetCollection.putPage(
            metadata,
            content,
        );

        const persistanceData: PagePersistanceData = {
            originName: pageItem.originName,
            collectionUniqueIdentifier: pageItem.collection.uniqueIdentifier,
            pageSnapshot: pageItem.pageSnapshot,
        };

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
