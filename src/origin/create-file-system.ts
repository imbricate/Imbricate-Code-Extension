/**
 * @author WMXPY
 * @namespace Origin
 * @description Create File System
 */

import { IRawImbricateConfiguration, ImbricateOriginManager, digestString, persistImbricateConfiguration, readOrCreateRawImbricateConfiguration, resolveImbricateHomeDirectory } from "@imbricate/local-fundamental";
import { FileSystemImbricateOrigin, FileSystemOriginPayload } from "@imbricate/origin-file-system";
import * as vscode from "vscode";
import { PagesTreeViewDataProvider } from "../pages-tree-view/data-provider";
import { ScriptsTreeViewDataProvider } from "../scripts-tree-view/data-provider";
import { showErrorMessage } from "../util/show-message";
import { gatherTargetFolderInput } from "./gather-target-folder";

export const gatherAndCreateFileSystemOrigin = async (
    originName: string,
    pagesDataProvider: PagesTreeViewDataProvider,
    scriptsDataProvider: ScriptsTreeViewDataProvider,
    originManager: ImbricateOriginManager,
): Promise<void> => {

    const basePath: string | null = await gatherTargetFolderInput();

    if (!basePath) {
        return;
    }

    const defaultValue: string = "6";
    const asynchronousPoolLimitString: string | undefined = await vscode.window.showInputBox({
        title: "Create File System Origin - Asynchronous Pool Limit",
        prompt: "Asynchronous Pool Limit...",
        value: defaultValue,
        valueSelection: [0, defaultValue.length],
    });

    if (typeof asynchronousPoolLimitString === "undefined") {
        return;
    }

    const asynchronousPoolLimit = Number(asynchronousPoolLimitString);

    if (isNaN(asynchronousPoolLimit)) {
        showErrorMessage("Asynchronous Pool Limit must be a number");
        return;
    }

    if (!Number.isInteger(asynchronousPoolLimit)) {
        showErrorMessage("Asynchronous Pool Limit must be an integer");
        return;
    }

    if (asynchronousPoolLimit < 1) {
        showErrorMessage("Asynchronous Pool Limit must be greater than 0");
        return;
    }

    const configurationPath: string = resolveImbricateHomeDirectory();
    const rawConfig: IRawImbricateConfiguration = await readOrCreateRawImbricateConfiguration(configurationPath);

    const payloads: FileSystemOriginPayload = {
        asynchronousPoolLimit,
        basePath,
    };

    const hashedPath = digestString(basePath);
    const uniqueIdentifier: string = `file-system-${hashedPath}`;

    const updatedRawConfig: IRawImbricateConfiguration = {
        ...rawConfig,
        origins: [
            ...rawConfig.origins,
            {
                originType: "file-system",
                uniqueIdentifier,
                originName,
                payloads,
            },
        ],
    };

    await persistImbricateConfiguration(configurationPath, updatedRawConfig);

    const newOrigin = FileSystemImbricateOrigin.withPayloads(
        payloads,
    );

    originManager.putOrigin(originName, newOrigin);

    pagesDataProvider.refresh();
    scriptsDataProvider.refresh();
};
