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
): Promise<void> => {

    const editingDataProvider = await EditingTreeViewDataProvider.create(
        configuration,
    );

    vscode.window.registerTreeDataProvider("imbricate-editings", editingDataProvider);
};
