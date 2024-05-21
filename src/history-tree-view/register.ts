/**
 * @author WMXPY
 * @namespace HistoryTreeView
 * @description Register
 */

import { IImbricateConfiguration } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { HistoryTreeViewDataProvider } from "./data-provider";

export const registerHistoryTreeView = async (
    configuration: IImbricateConfiguration,
    context: vscode.ExtensionContext,
): Promise<HistoryTreeViewDataProvider> => {

    const historiesDataProvider = await HistoryTreeViewDataProvider.create(
        configuration,
    );

    const treeView = vscode.window.createTreeView("imbricate-histories", {
        treeDataProvider: historiesDataProvider,
        showCollapseAll: false,
        canSelectMany: false,
    });

    context.subscriptions.push(treeView);

    return historiesDataProvider;
};
