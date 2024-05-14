/**
 * @author WMXPY
 * @namespace PagesTreeView
 * @description Directory Item
 */

import { IImbricateCollection, ImbricatePageSnapshot } from "@imbricate/core";
import * as vscode from "vscode";
import { PagePageItem } from "./page-item";

export class PageDirectoryItem extends vscode.TreeItem {

    public static withDirectories(
        originName: string,
        collection: IImbricateCollection,
        directories: string[],
    ) {

        return new PageDirectoryItem(
            originName,
            collection,
            directories,
        );
    }

    private readonly _originName: string;
    private readonly _collection: IImbricateCollection;

    private readonly _directories: string[];

    private constructor(
        originName: string,
        collection: IImbricateCollection,
        directories: string[],
    ) {

        super(directories[directories.length - 1], vscode.TreeItemCollapsibleState.Collapsed);

        this.contextValue = "page-directory-item";

        this.iconPath = new vscode.ThemeIcon("folder");

        this._originName = originName;
        this._collection = collection;

        this._directories = directories;

        this.tooltip = this._buildTooltip();
    }

    public get originName(): string {
        return this._originName;
    }

    public get collection(): IImbricateCollection {
        return this._collection;
    }

    public get directories(): string[] {
        return this._directories;
    }

    private _buildTooltip(): string {

        return this._originName + " - " + this._collection.collectionName
            + "\n"
            + this._directories.join("/");
    }
}

export const renderPageDirectoryItem = async (item: PageDirectoryItem): Promise<vscode.TreeItem[]> => {

    const pages: ImbricatePageSnapshot[] =
        await item.collection.listPages(
            item.directories,
            false,
        );

    const directories: string[] =
        await item.collection.listDirectories(
            item.directories,
        );

    return [
        ...directories.map((directory: string) => {
            return PageDirectoryItem.withDirectories(
                item.originName,
                item.collection,
                [
                    ...item.directories,
                    directory,
                ],
            );
        }),
        ...pages.map((page: ImbricatePageSnapshot) => {
            return PagePageItem.withSnapshot(
                item.originName,
                item.collection,
                page,
            );
        }),
    ];
};
