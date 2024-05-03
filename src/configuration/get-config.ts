/**
 * @author WMXPY
 * @namespace Configuration
 * @description Get Config
 */

import * as vscode from "vscode";

export enum CONFIG_KEY {

    PAGE_RECENT_ENABLE = "page.recent.enable",
    PAGE_RECENT_MAXIMUM = "page.recent.maximum",
}

export const getConfiguration = <T>(
    configKey: CONFIG_KEY,
): T => {

    const configuration: vscode.WorkspaceConfiguration =
        vscode.workspace.getConfiguration("imbricate");

    const result: T | undefined = configuration.get(configKey);

    if (typeof result === "undefined") {
        throw new Error(`Config ${configKey} not found`);
    }

    return result;
};
