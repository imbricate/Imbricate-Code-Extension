/**
 * @author WMXPY
 * @namespace Command
 * @description Toggle Page Tree View Mode
 */

import * as vscode from "vscode";
import { PagesTreeViewDataProvider } from "../pages-tree-view/data-provider";
import { PAGES_TREE_VIEW_MODE, PAGES_TREE_VIEW_MODE_KEY } from "../pages-tree-view/page-data";

export const registerTogglePageTreeViewModeCommand = (
    pagesDataProvider: PagesTreeViewDataProvider,
    context: vscode.ExtensionContext,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.page-tree-view.mode.toggle", async () => {

            const currentMode: PAGES_TREE_VIEW_MODE | undefined =
                context.globalState.get(PAGES_TREE_VIEW_MODE_KEY);

            if (currentMode === PAGES_TREE_VIEW_MODE.COLLECTION) {

                await context.globalState.update(
                    PAGES_TREE_VIEW_MODE_KEY,
                    PAGES_TREE_VIEW_MODE.ORIGIN,
                );

                pagesDataProvider.refresh();
                return;
            }

            await context.globalState.update(
                PAGES_TREE_VIEW_MODE_KEY,
                PAGES_TREE_VIEW_MODE.COLLECTION,
            );

            pagesDataProvider.refresh();
            return;
        });

    return disposable;
};
