/**
 * @author WMXPY
 * @namespace OriginsTreeView
 * @description Register
 */

import { ImbricateOriginManager } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { OriginsTreeViewDataProvider } from "./data-provider";

export const registerOriginsTreeView = async (
    originManager: ImbricateOriginManager,
    context: vscode.ExtensionContext,
): Promise<OriginsTreeViewDataProvider> => {

    const originsDataProvider = await OriginsTreeViewDataProvider.create(
        originManager,
    );

    const treeView = vscode.window.createTreeView("imbricate-origins", {
        treeDataProvider: originsDataProvider,
        showCollapseAll: false,
        canSelectMany: false,
    });

    context.subscriptions.push(treeView);

    return originsDataProvider;
};
