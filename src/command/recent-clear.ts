/**
 * @author WMXPY
 * @namespace Command
 * @description Recent Clear
 */

import * as vscode from "vscode";
import { PagesTreeViewDataProvider } from "../pages-tree-view/data-provider";
import { PAGES_RECENTS_KEY } from "../pages-tree-view/page-data";

export const registerPageRecentClearCommand = (
    pagesDataProvider: PagesTreeViewDataProvider,
    context: vscode.ExtensionContext,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.page.recent.clear", async (
    ) => {

        await context.globalState.update(
            PAGES_RECENTS_KEY,
            [],
        );

        pagesDataProvider.refresh();
    });

    return disposable;
};
