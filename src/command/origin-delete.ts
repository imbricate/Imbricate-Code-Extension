/**
 * @author WMXPY
 * @namespace Command
 * @description Origin Delete
 */

import { ImbricateOriginManager } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { OriginsTreeViewDataProvider } from "../origins-tree-view/data-provider";
import { OriginOriginItem } from "../origins-tree-view/origin-item";
import { PagesTreeViewDataProvider } from "../pages-tree-view/data-provider";
import { ScriptsTreeViewDataProvider } from "../scripts-tree-view/data-provider";

export const registerOriginDeleteCommand = (
    _originManager: ImbricateOriginManager,
    _originsDataProvider: OriginsTreeViewDataProvider,
    _pagesDataProvider: PagesTreeViewDataProvider,
    _scriptsDataProvider: ScriptsTreeViewDataProvider,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.origin.delete", async (
            _item: OriginOriginItem,
        ) => {
    });

    return disposable;
};
