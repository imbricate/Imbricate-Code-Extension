/**
 * @author WMXPY
 * @namespace Origin
 * @description Create File System
 */

import { IRawImbricateConfiguration, ImbricateOriginManager, digestString, persistImbricateConfiguration, readOrCreateRawImbricateConfiguration, resolveImbricateHomeDirectory } from "@imbricate/local-fundamental";
import { SimpleFileSystemImbricateOrigin, SimpleFileSystemOriginPayload } from "@imbricate/origin-simple-file-system";
import * as vscode from "vscode";
import { PagesTreeViewDataProvider } from "../pages-tree-view/data-provider";
import { ScriptsTreeViewDataProvider } from "../scripts-tree-view/data-provider";
import { gatherTargetFolderInput } from "./gather-target-folder";

export const gatherAndCreateSimpleFileSystemOrigin = async (
    originName: string,
    pagesDataProvider: PagesTreeViewDataProvider,
    scriptsDataProvider: ScriptsTreeViewDataProvider,
    originManager: ImbricateOriginManager,
): Promise<void> => {

    const basePath: string | null = await gatherTargetFolderInput();

    if (!basePath) {
        return;
    }

    const collectionNameString: string | undefined = await vscode.window.showInputBox({
        title: "Create Simple File System Origin - Collection Name",
        prompt: "Simple File System Origin Collection Name...",
        validateInput: (value: string) => {

            if (value.length < 2) {
                return "Collection name must be longer than or equal 2 characters";
            }

            return undefined;
        },
    });

    if (typeof collectionNameString === "undefined") {
        return;
    }

    const configurationPath: string = resolveImbricateHomeDirectory();
    const rawConfig: IRawImbricateConfiguration = await readOrCreateRawImbricateConfiguration(configurationPath);

    const payloads: SimpleFileSystemOriginPayload = {
        collectionName: collectionNameString,
        basePath,
    };

    const hashedPath = digestString(basePath);
    const uniqueIdentifier: string = `file-system-${hashedPath}`;

    const updatedRawConfig: IRawImbricateConfiguration = {
        ...rawConfig,
        origins: [
            ...rawConfig.origins,
            {
                originType: "simple-file-system",
                uniqueIdentifier,
                originName,
                payloads,
            },
        ],
    };

    await persistImbricateConfiguration(configurationPath, updatedRawConfig);

    const newOrigin = SimpleFileSystemImbricateOrigin.withPayload(
        payloads,
    );

    originManager.putOrigin(originName, newOrigin);

    pagesDataProvider.refresh();
    scriptsDataProvider.refresh();
};
