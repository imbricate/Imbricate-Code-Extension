/**
 * @author WMXPY
 * @namespace Command
 * @description Page Render
 */

import { IImbricatePage } from "@imbricate/core";
import { renderMarkdownToHtml } from "@imbricate/markdown-render";
import * as vscode from "vscode";
import { PagesTreeViewDataProvider } from "../pages-tree-view/data-provider";
import { PagePersistanceData } from "../pages-tree-view/page-data";
import { PagePageItem } from "../pages-tree-view/page-item";
import { recordRecentPage } from "../util/recent";
import { showErrorMessage } from "../util/show-message";

export const registerPageEditCommand = (
    pagesDataProvider: PagesTreeViewDataProvider,
    context: vscode.ExtensionContext,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand("imbricate.page.render", async (item: PagePageItem) => {

        const page: IImbricatePage | null =
            await item.collection.getPage(item.pageSnapshot.identifier);

        if (!page) {
            showErrorMessage(`Cannot find page: ${item.pageSnapshot.title}`);
            return;
        }

        const content: string = await page.readContent();

        const parsed: string = await renderMarkdownToHtml(content);


        const persistanceData: PagePersistanceData = {
            originName: item.originName,
            collectionUniqueIdentifier: item.collection.uniqueIdentifier,
            pageSnapshot: item.pageSnapshot,
        };

        await recordRecentPage(
            persistanceData,
            pagesDataProvider,
            context,
        );
    });

    return disposable;
};
