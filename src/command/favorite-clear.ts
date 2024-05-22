/**
 * @author WMXPY
 * @namespace Command
 * @description Favorite Clear
 */

import * as vscode from "vscode";
import { PagesTreeViewDataProvider } from "../pages-tree-view/data-provider";
import { PAGES_FAVORITES_KEY } from "../pages-tree-view/page-data";

export const registerPageFavoriteClearCommand = (
    pagesDataProvider: PagesTreeViewDataProvider,
    context: vscode.ExtensionContext,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.page.favorite.clear", async (
    ) => {

        await context.globalState.update(
            PAGES_FAVORITES_KEY,
            [],
        );

        pagesDataProvider.refresh();
    });

    return disposable;
};
