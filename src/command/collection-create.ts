/**
 * @author WMXPY
 * @namespace Command
 * @description Collection Create
 */

import * as vscode from "vscode";
import { PagesTreeViewDataProvider } from "../pages-tree-view/data-provider";
import { PagesOriginItem } from "../pages-tree-view/origin-item";

export const registerCollectionCreateCommand = (
    pagesDataProvider: PagesTreeViewDataProvider,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.collection.create", async (
            originItem: PagesOriginItem,
        ) => {

        const collectionName: string | undefined = await vscode.window.showInputBox({
            title: "Create Collection",
            prompt: "New Collection Name...",
            placeHolder: "Collection Name...",
            validateInput: (value: string) => {

                if (value.length < 2) {
                    return "Collection name must be longer than or equal 2 characters";
                }

                return undefined;
            },
        });

        if (!collectionName) {
            return;
        }

        await originItem.origin
            .getCollectionManager()
            .createCollection(
                collectionName,
            );

        pagesDataProvider.refresh();
    });

    return disposable;
};
