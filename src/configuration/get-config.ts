/**
 * @author WMXPY
 * @namespace Configuration
 * @description Get Config
 */

import * as vscode from "vscode";

export enum CONFIG_KEY {

    PAGE_RECENT_ENABLE = "imbricate.page.recent.enable",
    PAGE_RECENT_MAXIMUM = "imbricate.page.recent.maximum",
}

export const getConfiguration = <T>(
    configKey: CONFIG_KEY,
    defaultValue: T,
): T => {

    const configuration: vscode.WorkspaceConfiguration =
        vscode.workspace.getConfiguration("imbricateQuill");

    const result: T | undefined = configuration.get(configKey);

    if (typeof result !== "undefined") {
        return result;
    }

    return defaultValue;
};
