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
): Promise<PagesTreeViewDataProvider> => {

    const pagesDataProvider = await PagesTreeViewDataProvider.create(
        configuration,
        originManager,
    );

    vscode.window.registerTreeDataProvider("imbricate-pages", pagesDataProvider);

    return pagesDataProvider;
};
