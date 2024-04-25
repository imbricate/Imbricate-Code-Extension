/**
 * @author WMXPY
 * @namespace Command
 * @description Page Refresh
 */

import * as vscode from "vscode";
import { PagesTreeViewDataProvider } from "../pages-tree-view/data-provider";

export const registerPagesRefreshCommand = (
    pagesDataProvider: PagesTreeViewDataProvider,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand("imbricate.pages.refresh", () => {
        pagesDataProvider.refresh();
    });

    return disposable;
};
