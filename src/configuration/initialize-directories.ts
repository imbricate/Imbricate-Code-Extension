/**
 * @author WMXPY
 * @namespace Configuration
 * @description Initialize Directories
 */

import { IImbricateOrigin } from "@imbricate/core";
import { ImbricateOriginManager } from "@imbricate/local-fundamental";
import { SimpleFileSystemImbricateOrigin } from "@imbricate/origin-simple-file-system";
import { joinPath } from "@sudoo/io";
import * as vscode from "vscode";
import { logInfo } from "../util/output-channel";
import { getLastFolderName } from "../util/path";
import { CONFIG_KEY, getConfiguration } from "./get-config";

export const initializeOriginManagerDirectories = (
    originManager: ImbricateOriginManager,
): void => {

    const documentDirectories: string[] =
        getConfiguration(CONFIG_KEY.WORKSPACE_DIRECTORY_DOCUMENT);

    if (documentDirectories.length === 0) {
        logInfo("[initializeOriginManagerDirectories] No Document Directories");
    } else {
        logInfo(`[initializeOriginManagerDirectories] Document Directories: ${documentDirectories.join(", ")}`);
    }

    if (typeof vscode.workspace.workspaceFolders === "undefined") {

        logInfo("[initializeOriginManagerDirectories] No Workspace Folders");
        return;
    }

    for (const workspaceFolder of vscode.workspace.workspaceFolders) {

        const path: string = workspaceFolder.uri.fsPath;
        const pathDirName: string = getLastFolderName(path);

        for (const documentDirectory of documentDirectories) {

            const documentPath: string = joinPath(path, documentDirectory);

            const originName: string = `${pathDirName} - ${documentDirectory}`;
            const origin: IImbricateOrigin = SimpleFileSystemImbricateOrigin.withPayload({
                basePath: documentPath,
                collectionName: originName,
            });

            originManager.putOrigin(originName, origin);
        }
    }
};
