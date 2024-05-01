/**
 * @author WMXPY
 * @namespace ScriptsTreeView
 * @description Register
 */

import { IImbricateConfiguration, ImbricateOriginManager } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { ScriptsTreeViewDataProvider } from "./data-provider";

export const registerScriptsTreeView = async (
    configuration: IImbricateConfiguration,
    originManager: ImbricateOriginManager,
    context: vscode.ExtensionContext,
): Promise<ScriptsTreeViewDataProvider> => {

    const scriptsDataProvider = await ScriptsTreeViewDataProvider.create(
        configuration,
        originManager,
    );

    const treeView = vscode.window.createTreeView("imbricate-scripts", {
        treeDataProvider: scriptsDataProvider,
        showCollapseAll: true,
        canSelectMany: false,
    });

    context.subscriptions.push(treeView);

    return scriptsDataProvider;
};
