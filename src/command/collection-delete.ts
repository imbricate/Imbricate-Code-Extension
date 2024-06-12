/**
 * @author WMXPY
 * @namespace Command
 * @description Collection Delete
 */

import { IImbricateOrigin } from "@imbricate/core";
import { ImbricateOriginManager } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { PagesCollectionItem } from "../pages-tree-view/collection-item";
import { PagesTreeViewDataProvider } from "../pages-tree-view/data-provider";
import { showErrorMessage } from "../util/show-message";

export const registerCollectionDeleteCommand = (
    pagesDataProvider: PagesTreeViewDataProvider,
    originManager: ImbricateOriginManager,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.collection.delete", async (
            collectionItem: PagesCollectionItem,
        ) => {

        const origin: IImbricateOrigin | null =
            originManager.getOrigin(collectionItem.originName);

        if (!origin) {
            showErrorMessage("Origin Not Found");
            return;
        }

        const result: vscode.MessageItem | undefined = await vscode.window.showInformationMessage(
            `Deleting Collection\n[${collectionItem.collection.collectionName}]`,
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

        await origin
            .getCollectionManager()
            .deleteCollection(
                collectionItem.collection.uniqueIdentifier,
            );

        pagesDataProvider.refresh();
    });

    return disposable;
};
