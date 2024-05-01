/**
 * @author WMXPY
 * @namespace PagesTreeView
 * @description Register
 */

import { IImbricateConfiguration, ImbricateOriginManager } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { PagesTreeViewDataProvider } from "./data-provider";

export const registerPagesTreeView = async (
    configuration: IImbricateConfiguration,
    originManager: ImbricateOriginManager,
    context: vscode.ExtensionContext,
): Promise<PagesTreeViewDataProvider> => {

    const pagesDataProvider = await PagesTreeViewDataProvider.create(
        configuration,
        originManager,
    );

    const treeView = vscode.window.createTreeView("imbricate-pages", {
        treeDataProvider: pagesDataProvider,
        showCollapseAll: true,
        canSelectMany: false,
        dragAndDropController: pagesDataProvider,
    });

    context.subscriptions.push(treeView);

    return pagesDataProvider;
};
