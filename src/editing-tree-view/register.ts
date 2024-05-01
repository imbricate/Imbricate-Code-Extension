/**
 * @author WMXPY
 * @namespace EditingTreeView
 * @description Register
 */

import { IImbricateConfiguration } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { EditingTreeViewDataProvider } from "./data-provider";

export const registerEditingTreeView = async (
    configuration: IImbricateConfiguration,
    context: vscode.ExtensionContext,
): Promise<EditingTreeViewDataProvider> => {

    const editingDataProvider = await EditingTreeViewDataProvider.create(
        configuration,
    );

    const treeView = vscode.window.createTreeView("imbricate-editings", {
        treeDataProvider: editingDataProvider,
        showCollapseAll: false,
        canSelectMany: false,
    });

    context.subscriptions.push(treeView);

    return editingDataProvider;
};
