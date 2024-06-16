/**
 * @author WMXPY
 * @namespace Configuration
 * @description Get Config
 */

import * as vscode from "vscode";

export enum CONFIG_KEY {

    PAGE_RECENT_ENABLE = "page.recent.enable",
    PAGE_RECENT_MAXIMUM = "page.recent.maximum",

    COPY_CODE_BLOCK_ENABLE = "copy.code-block.enable",
    COPY_SNIPPET_ENABLE = "copy.snippet.enable",

    REDIRECT_INLINE_ENABLE = "redirect.inline.enable",

    RUN_CODE_BLOCK_ENABLE = "run.code-block.enable",

    WORKSPACE_DIRECTORY_DOCUMENT = "workspace.directory.document",
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
