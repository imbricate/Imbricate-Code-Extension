/**
 * @author WMXPY
 * @namespace Command
 * @description Page Preview
 */

import * as vscode from "vscode";
import { PagesTreeViewDataProvider } from "../pages-tree-view/data-provider";
import { PagePersistanceData } from "../pages-tree-view/page-data";
import { PagePageItem } from "../pages-tree-view/page-item";
import { recordRecentPage } from "../util/recent";
import { concatPageMarkdownUrl } from "../virtual-document/page-markdown/concat";
import { ImbricateOriginManager } from "@imbricate/local-fundamental";

export const registerPagePreviewCommand = (
    originManager: ImbricateOriginManager,
    pageDataProvider: PagesTreeViewDataProvider,
    context: vscode.ExtensionContext,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.page.preview", async (
            item: PagePageItem,
        ) => {

        const uri = concatPageMarkdownUrl(
            item.originName,
            item.collection.uniqueIdentifier,
            item.pageSnapshot.identifier,
        );

        const textDocument: vscode.TextDocument =
            await vscode.workspace.openTextDocument(uri);

        await vscode.window.showTextDocument(textDocument);

        const persistanceData: PagePersistanceData = {
            originName: item.originName,
            collectionUniqueIdentifier: item.collection.uniqueIdentifier,
            pageSnapshot: item.pageSnapshot,
        };

        await recordRecentPage(
            originManager,
            persistanceData,
            pageDataProvider,
            context,
        );
    });

    return disposable;
};
