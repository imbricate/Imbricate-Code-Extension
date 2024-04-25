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
): Promise<ScriptsTreeViewDataProvider> => {

    const scriptsDataProvider = await ScriptsTreeViewDataProvider.create(
        configuration,
        originManager,
    );

    vscode.window.registerTreeDataProvider("imbricate-scripts", scriptsDataProvider);

    return scriptsDataProvider;
};
