/**
 * @author WMXPY
 * @namespace Command
 * @description Origin Create
 */

import { ImbricateOriginManager } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { gatherAndCreateFileSystemOrigin } from "../origin/create-file-system";
import { gatherAndCreateMongoOrigin } from "../origin/create-mongo";
import { gatherAndCreateSimpleFileSystemOrigin } from "../origin/create-simple-file-system";
import { gatherOriginTypeInput } from "../origin/gather-origin-type";
import { PagesTreeViewDataProvider } from "../pages-tree-view/data-provider";
import { ScriptsTreeViewDataProvider } from "../scripts-tree-view/data-provider";
import { showErrorMessage } from "../util/show-message";

export const registerOriginCreateCommand = (
    pagesDataProvider: PagesTreeViewDataProvider,
    scriptsDataProvider: ScriptsTreeViewDataProvider,
    originManager: ImbricateOriginManager,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.origin.create", async (
    ) => {

        const originName: string | undefined = await vscode.window.showInputBox({
            title: "Create File System Origin",
            prompt: "Origin Name...",
            placeHolder: "The name of the origin...",
            validateInput: (value: string) => {

                if (value.length <= 2) {
                    return "Origin name must be longer than 2 characters";
                }
                return undefined;
            },
        });

        if (typeof originName === "undefined") {
            return;
        }

        const originType: string | null = await gatherOriginTypeInput();

        if (!originType) {
            return;
        }

        switch (originType) {
            case "file-system": {

                await gatherAndCreateFileSystemOrigin(
                    originName,
                    pagesDataProvider,
                    scriptsDataProvider,
                    originManager,
                );
                return;
            }
            case "mongo": {

                await gatherAndCreateMongoOrigin(
                    originName,
                    pagesDataProvider,
                    scriptsDataProvider,
                    originManager,
                );
                return;
            }
            case "simple-file-system": {

                await gatherAndCreateSimpleFileSystemOrigin(
                    originName,
                    pagesDataProvider,
                    scriptsDataProvider,
                    originManager,
                );
                return;
            }
        }

        showErrorMessage("Unknown Origin Type");
    });

    return disposable;
};
