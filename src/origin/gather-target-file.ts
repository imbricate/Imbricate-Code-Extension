/**
 * @author WMXPY
 * @namespace Origin
 * @description Gather Target File
 */

import * as vscode from "vscode";

export const gatherTargetFileInput = async (): Promise<string | null> => {

    const options: vscode.OpenDialogOptions = {
        title: "Target File",
        canSelectMany: false,
        openLabel: "Select",
        canSelectFiles: true,
        canSelectFolders: false,
    };

    const result = await vscode.window.showOpenDialog(options);

    if (!result || result.length <= 0) {
        return null;
    }

    return result[0].path;
};
