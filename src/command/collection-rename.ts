/**
 * @author WMXPY
 * @namespace Command
 * @description Collection Rename
 */

import { IImbricateOrigin } from "@imbricate/core";
import { ImbricateOriginManager } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { PagesCollectionItem } from "../pages-tree-view/collection-item";
import { PagesTreeViewDataProvider } from "../pages-tree-view/data-provider";
import { showErrorMessage } from "../util/show-message";

export const registerCollectionRenameCommand = (
    pagesDataProvider: PagesTreeViewDataProvider,
    originManager: ImbricateOriginManager,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.collection.rename", async (
            collectionItem: PagesCollectionItem,
        ) => {

        const origin: IImbricateOrigin | null =
            originManager.getOrigin(collectionItem.originName);

        if (!origin) {
            showErrorMessage("Origin Not Found");
            return;
        }

        const newCollectionName: string | undefined = await vscode.window.showInputBox({
            title: "Rename Collection",
            prompt: `Renaming Collection ${collectionItem.collection.collectionName}...`,
            placeHolder: "New Collection Name...",
        });

        if (!newCollectionName) {
            return;
        }

        await origin.renameCollection(
            collectionItem.collection.collectionName,
            newCollectionName,
        );

        pagesDataProvider.refresh();
    });

    return disposable;
};
