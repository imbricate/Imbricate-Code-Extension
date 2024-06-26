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
            value: collectionItem.collection.collectionName,
            valueSelection: [0, collectionItem.collection.collectionName.length],
            validateInput: (value: string) => {

                if (value === collectionItem.collection.collectionName) {
                    return "New collection name should not be the same as the old one";
                }

                return undefined;
            },
            placeHolder: "New Collection Name...",
        });

        if (!newCollectionName) {
            return;
        }

        const alreadyExist: boolean = await origin
            .getCollectionManager()
            .hasCollection(
                newCollectionName,
            );

        if (alreadyExist) {
            showErrorMessage("Collection Already Exist");
            return;
        }

        await origin
            .getCollectionManager()
            .renameCollection(
                collectionItem.collection.uniqueIdentifier,
                newCollectionName,
            );

        pagesDataProvider.refresh();
    });

    return disposable;
};
