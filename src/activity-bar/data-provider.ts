/**
 * @author WMXPY
 * @namespace ActivityBar
 * @description Sidebar
 */
import { IImbricateOrigin, IImbricateOriginCollection } from "@imbricate/core";
import { ImbricateOriginInitializer, ImbricateOriginManager } from "@imbricate/local-fundamental";
import { FileSystemImbricateOrigin, FileSystemOriginPayload } from "@imbricate/origin-file-system";
import * as vscode from "vscode";
import { IImbricateConfiguration } from "../configuration/definition";
import { readCLIConfiguration } from "../configuration/io";
import { IImbricateConfigurationOrigin } from "../configuration/raw-definition";
import { resolveImbricateHomeDirectory } from "../util/directory-resolve";
import { CollectionItem } from "./collection-item";
import { OriginItem } from "./origin-item";
import { PlaceholderItem } from "./placeholder-item";

export class ImbricateActivityDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

    public static async fromHomeConfig(): Promise<ImbricateActivityDataProvider> {

        const originInitializer: ImbricateOriginInitializer = ImbricateOriginInitializer.create();

        originInitializer.registerOriginConstructor(
            "file-system",
            (origin: IImbricateConfigurationOrigin) => {
                return FileSystemImbricateOrigin.withPayloads(
                    origin.payloads as FileSystemOriginPayload,
                );
            }
        );

        const configurationPath: string = resolveImbricateHomeDirectory();
        const configuration = await readCLIConfiguration(configurationPath);

        const originManager = originInitializer.initializeOrigins(configuration.origins);

        return new ImbricateActivityDataProvider(
            configuration,
            originManager,
        );
    }

    private readonly _configuration: IImbricateConfiguration;
    private readonly _originManager: ImbricateOriginManager;

    private _onDidChangeTreeData:
        vscode.EventEmitter<vscode.TreeItem | undefined | void> =
        new vscode.EventEmitter<vscode.TreeItem | undefined | void>();

    public readonly onDidChangeTreeData:
        vscode.Event<vscode.TreeItem | undefined | void> =
        this._onDidChangeTreeData.event;

    private constructor(
        configuration: IImbricateConfiguration,
        originManager: ImbricateOriginManager,
    ) {

        this._configuration = configuration;
        this._originManager = originManager;
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: vscode.TreeItem): Promise<vscode.TreeItem[]> {

        if (typeof element === "undefined") {

            const items: vscode.TreeItem[] = this._configuration.origins.map((
                originConfig: IImbricateConfigurationOrigin,
            ) => {

                const origin: IImbricateOrigin | null =
                    this._originManager.getOrigin(originConfig.originName);

                if (!origin) {
                    return new PlaceholderItem();
                }

                return OriginItem.withOrigin(
                    originConfig.originName,
                    origin,
                );
            });

            return Promise.resolve(items);
        }

        if (element instanceof OriginItem) {

            const collections = await element.origin.listCollections();

            return collections.map((
                collection: IImbricateOriginCollection,
            ) => {
                return CollectionItem.withCollection(collection);
            });
        }

        return Promise.resolve([
            new PlaceholderItem(),
        ]);
    }
}
