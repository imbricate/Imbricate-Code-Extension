/**
 * @author WMXPY
 * @namespace PagesTreeView
 * @description Register
 */

import { ImbricateOriginManager } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { PagesTreeViewDataProvider } from "./data-provider";

export const registerPagesTreeView = async (
    originManager: ImbricateOriginManager,
    context: vscode.ExtensionContext,
): Promise<PagesTreeViewDataProvider> => {

    const pagesDataProvider = await PagesTreeViewDataProvider.create(
        originManager,
        context,
    );

    const treeView = vscode.window.createTreeView("imbricate-pages", {
        treeDataProvider: pagesDataProvider,
        showCollapseAll: true,
        canSelectMany: false,
    });

    context.subscriptions.push(treeView);

    return pagesDataProvider;
};
