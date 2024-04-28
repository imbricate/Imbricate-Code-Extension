/**
 * @author WMXPY
 * @namespace PagesTreeView
 * @description Data Provider
 */

import { IImbricateOrigin, IImbricateOriginCollection, ImbricatePageSnapshot } from "@imbricate/core";
import { IImbricateConfiguration, IImbricateConfigurationOrigin, ImbricateOriginManager } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { PagesCollectionItem } from "./collection-item";
import { PageDirectoryItem } from "./directory-item";
import { PagesOriginItem } from "./origin-item";
import { PagePageItem } from "./page-item";

export class PagesTreeViewDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

    public static async create(
        configuration: IImbricateConfiguration,
        originManager: ImbricateOriginManager,
    ): Promise<PagesTreeViewDataProvider> {

        return new PagesTreeViewDataProvider(
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

    public refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    public getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
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
                    return new vscode.TreeItem("test");
                }

                return PagesOriginItem.withOrigin(
                    originConfig.originName,
                    origin,
                );
            });

            return Promise.resolve(items);
        }

        if (element instanceof PageDirectoryItem) {

            const pages: ImbricatePageSnapshot[] =
                await element.collection.listPages(
                    element.directories,
                    false,
                );

            const directories: string[] =
                await element.collection.listDirectories(
                    element.directories,
                );

            return [
                ...directories.map((directory: string) => {
                    return PageDirectoryItem.withDirectories(
                        element.originName,
                        element.collection,
                        [
                            ...element.directories,
                            directory,
                        ],
                    );
                }),
                ...pages.map((page: ImbricatePageSnapshot) => {
                    return PagePageItem.withSnapshot(
                        element.originName,
                        element.collection,
                        page,
                    );
                }),
            ];
        }

        if (element instanceof PagesOriginItem) {

            const collections = await element.origin.listCollections();

            return collections.map((
                collection: IImbricateOriginCollection,
            ) => {
                return PagesCollectionItem.withCollection(
                    element.originName,
                    collection,
                );
            });
        }

        if (element instanceof PagesCollectionItem) {

            const pages: ImbricatePageSnapshot[] =
                await element.collection.listPages([], false);

            const directories: string[] =
                await element.collection.listDirectories([]);

            return [
                ...directories.map((directory: string) => {
                    return PageDirectoryItem.withDirectories(
                        element.originName,
                        element.collection,
                        [directory],
                    );
                }),
                ...pages.map((page: ImbricatePageSnapshot) => {
                    return PagePageItem.withSnapshot(
                        element.originName,
                        element.collection,
                        page,
                    );
                }),
            ];
        }

        return Promise.resolve([
            new vscode.TreeItem("ERROR!"),
        ]);
    }
}
