/**
 * @author WMXPY
 * @namespace PagesTreeView
 * @description Data Provider
 */

import { IImbricateOrigin, IImbricateOriginCollection, ImbricatePageSnapshot } from "@imbricate/core";
import { ImbricateOriginManager, ImbricateOriginManagerOriginResponse, ImbricateSearchPreference, readOrCreateSearchPreferenceConfiguration, resolveImbricateHomeDirectory } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { CONFIG_KEY, getConfiguration } from "../configuration/get-config";
import { PagesCollectionItem } from "./collection-item";
import { PageDirectoryItem, renderPageDirectoryItem } from "./directory-item";
import { PagesFavoriteItem, renderPageFavoriteItem } from "./favorite-item";
import { PagesOriginItem } from "./origin-item";
import { PagePageItem } from "./page-item";
import { PagesRecentItem, renderPageRecentItem } from "./recent-item";

export class PagesTreeViewDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

    public static async create(
        originManager: ImbricateOriginManager,
        context: vscode.ExtensionContext,
    ): Promise<PagesTreeViewDataProvider> {

        return new PagesTreeViewDataProvider(
            originManager,
            context,
        );
    }

    private readonly _originManager: ImbricateOriginManager;
    private readonly _context: vscode.ExtensionContext;

    private _loaded: boolean = false;

    private _onDidChangeTreeData:
        vscode.EventEmitter<vscode.TreeItem | undefined | void> =
        new vscode.EventEmitter<vscode.TreeItem | undefined | void>();

    public readonly onDidChangeTreeData:
        vscode.Event<vscode.TreeItem | undefined | void> =
        this._onDidChangeTreeData.event;

    private constructor(
        originManager: ImbricateOriginManager,
        context: vscode.ExtensionContext,
    ) {

        this._originManager = originManager;
        this._context = context;
    }

    public refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    public getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: vscode.TreeItem): Promise<vscode.TreeItem[]> {

        if (typeof element === "undefined") {

            const enableRecent: boolean =
                getConfiguration(CONFIG_KEY.PAGE_RECENT_ENABLE);

            const items: vscode.TreeItem[] = [];

            items.push(PagesFavoriteItem.create());

            if (enableRecent) {
                items.push(PagesRecentItem.create());
            }

            const originItems: vscode.TreeItem[] = this._originManager.origins.map((
                originConfig: ImbricateOriginManagerOriginResponse,
            ) => {

                const origin: IImbricateOrigin | null =
                    this._originManager.getOrigin(originConfig.originName);

                if (!origin) {
                    return new vscode.TreeItem("ERROR!");
                }

                return PagesOriginItem.withOrigin(
                    originConfig.originName,
                    origin,
                );
            });

            items.push(...originItems);

            if (!this._loaded) {

                this._loaded = true;

                console.log("Pages Tree Data Provider Loaded");
                vscode.commands.executeCommand("setContext", "imbricate.context.pages.loaded", true);
            }

            return Promise.resolve(items);
        }

        if (element instanceof PageDirectoryItem) {

            return await renderPageDirectoryItem(element);
        }

        if (element instanceof PagesOriginItem) {

            const collections = await element.origin.listCollections();

            const configurationPath: string = resolveImbricateHomeDirectory();
            const searchPreference: ImbricateSearchPreference =
                await readOrCreateSearchPreferenceConfiguration(
                    configurationPath,
                );

            return collections.map((
                collection: IImbricateOriginCollection,
            ) => {
                return PagesCollectionItem.withCollection(
                    element.originName,
                    collection,
                    searchPreference,
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

        if (element instanceof PagesFavoriteItem) {

            return await renderPageFavoriteItem(
                this._originManager,
                this._context,
            );
        }

        if (element instanceof PagesRecentItem) {

            return await renderPageRecentItem(
                this._originManager,
                this._context,
            );
        }

        return Promise.resolve([
            new vscode.TreeItem("ERROR!"),
        ]);
    }
}
