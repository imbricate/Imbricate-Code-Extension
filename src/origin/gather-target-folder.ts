/**
 * @author WMXPY
 * @namespace Origin
 * @description Gather Target Folder
 */

import * as vscode from "vscode";

export const gatherTargetFolderInput = async (): Promise<string | null> => {

    const options: vscode.OpenDialogOptions = {
        title: "Origin Base Path",
        canSelectMany: false,
        openLabel: "Select",
        canSelectFiles: false,
        canSelectFolders: true,
    };

    const result = await vscode.window.showOpenDialog(options);

    if (!result || result.length <= 0) {
        return null;
    }

    return result[0].path;
};
