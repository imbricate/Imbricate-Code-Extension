/**
 * @author WMXPY
 * @namespace Command
 * @description Collection Search Exclude
 */

import { IImbricateOrigin } from "@imbricate/core";
import { ImbricateOriginManager, excludeCollectionInSearch, resolveImbricateHomeDirectory } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { PagesCollectionItem } from "../pages-tree-view/collection-item";
import { PagesTreeViewDataProvider } from "../pages-tree-view/data-provider";
import { showErrorMessage } from "../util/show-message";

export const registerCollectionSearchExcludeCommand = (
    pagesDataProvider: PagesTreeViewDataProvider,
    originManager: ImbricateOriginManager,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.collection.search.exclude", async (
            collectionItem: PagesCollectionItem,
        ) => {

        const origin: IImbricateOrigin | null =
            originManager.getOrigin(collectionItem.originName);

        if (!origin) {
            showErrorMessage("Origin Not Found");
            return;
        }

        const configurationPath: string = resolveImbricateHomeDirectory();

        await excludeCollectionInSearch(
            configurationPath,
            collectionItem.originName,
            collectionItem.collection.collectionName,
        );

        pagesDataProvider.refresh();
    });

    return disposable;
};
