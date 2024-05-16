/**
 * @author WMXPY
 * @namespace Origin
 * @description Create Mongo
 */

import { IRawImbricateConfiguration, ImbricateOriginManager, digestString, persistImbricateConfiguration, readOrCreateRawImbricateConfiguration, resolveImbricateHomeDirectory } from "@imbricate/local-fundamental";
import { MongoImbricateOrigin } from "@imbricate/origin-mongo";
import * as vscode from "vscode";
import { PagesTreeViewDataProvider } from "../pages-tree-view/data-provider";
import { ScriptsTreeViewDataProvider } from "../scripts-tree-view/data-provider";

export const gatherAndCreateMongoOrigin = async (
    originName: string,
    pagesDataProvider: PagesTreeViewDataProvider,
    scriptsDataProvider: ScriptsTreeViewDataProvider,
    originManager: ImbricateOriginManager,
): Promise<void> => {

    const defaultValue: string = "mongodb://localhost:27017";
    const mongoConnectionString: string | undefined = await vscode.window.showInputBox({
        title: "Create Mongo Origin",
        prompt: "Mongo Connection String...",
        value: defaultValue,
        valueSelection: [0, defaultValue.length],
        validateInput: (value: string) => {

            if (!value.startsWith("mongodb://")) {
                return "Mongo Connection String must start with mongodb://";
            }
            return undefined;
        },
    });

    if (typeof mongoConnectionString === "undefined") {
        return;
    }

    const configurationPath: string = resolveImbricateHomeDirectory();
    const rawConfig: IRawImbricateConfiguration = await readOrCreateRawImbricateConfiguration(configurationPath);

    const payloads = {
        connectionString: mongoConnectionString,
    };

    const hashed = digestString(mongoConnectionString);

    const updatedRawConfig: IRawImbricateConfiguration = {
        ...rawConfig,
        origins: [
            ...rawConfig.origins,
            {
                originType: "mongo",
                uniqueIdentifier: hashed,
                originName,
                payloads,
            },
        ],
    };

    await persistImbricateConfiguration(configurationPath, updatedRawConfig);

    const newOrigin = await MongoImbricateOrigin.create(
        mongoConnectionString,
    );

    originManager.putOrigin(originName, newOrigin);

    pagesDataProvider.refresh();
    scriptsDataProvider.refresh();
};
