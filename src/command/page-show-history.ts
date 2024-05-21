/**
 * @author WMXPY
 * @namespace Command
 * @description Page Show History
 */

import { IImbricatePage } from "@imbricate/core";
import * as vscode from "vscode";
import { HistoryTreeViewDataProvider } from "../history-tree-view/data-provider";
import { PagePageItem } from "../pages-tree-view/page-item";
import { showErrorMessage } from "../util/show-message";

export const registerPageShowHistoryCommand = (
    historiesDataProvider: HistoryTreeViewDataProvider,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand("imbricate.page.show-history", async (
        item: PagePageItem,
    ) => {

        const page: IImbricatePage | null =
            await item.collection.getPage(item.pageSnapshot.identifier);

        if (!page) {
            showErrorMessage(`Cannot find page: ${item.pageSnapshot.title}`);
            return;
        }

        historiesDataProvider.showRecords(page.historyRecords);
    });

    return disposable;
};
