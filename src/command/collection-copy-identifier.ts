/**
 * @author WMXPY
 * @namespace Command
 * @description Collection Copy Identifier
 */

import * as vscode from "vscode";
import { PagesCollectionItem } from "../pages-tree-view/collection-item";

export const registerCollectionCopyIdentifierCommand = (
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.collection.copy.identifier", async (
            collectionItem: PagesCollectionItem,
        ) => {

        await vscode.env.clipboard.writeText(
            collectionItem.collection.uniqueIdentifier,
        );
    });

    return disposable;
};
