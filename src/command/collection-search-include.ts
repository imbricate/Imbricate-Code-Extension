/**
 * @author WMXPY
 * @namespace Command
 * @description Collection Search Include
 */

import { IImbricateOrigin } from "@imbricate/core";
import { ImbricateOriginManager, includeCollectionInSearch, resolveImbricateHomeDirectory } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { PagesCollectionItem } from "../pages-tree-view/collection-item";
import { PagesTreeViewDataProvider } from "../pages-tree-view/data-provider";
import { showErrorMessage } from "../util/show-message";

export const registerCollectionSearchIncludeCommand = (
    pagesDataProvider: PagesTreeViewDataProvider,
    originManager: ImbricateOriginManager,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.collection.search.include", async (
            collectionItem: PagesCollectionItem,
        ) => {

        const origin: IImbricateOrigin | null =
            originManager.getOrigin(collectionItem.originName);

        if (!origin) {
            showErrorMessage("Origin Not Found");
            return;
        }

        const configurationPath: string = resolveImbricateHomeDirectory();

        await includeCollectionInSearch(
            configurationPath,
            collectionItem.originName,
            collectionItem.collection.uniqueIdentifier,
        );

        pagesDataProvider.refresh();
    });

    return disposable;
};
