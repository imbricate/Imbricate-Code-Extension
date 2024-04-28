/**
 * @author WMXPY
 * @namespace PagesTreeView
 * @description Directory Item
 */

import { IImbricateOriginCollection } from "@imbricate/core";
import * as vscode from "vscode";

export class PageDirectoryItem extends vscode.TreeItem {

    public static withDirectories(
        originName: string,
        collection: IImbricateOriginCollection,
        directories: string[],
    ) {

        return new PageDirectoryItem(
            originName,
            collection,
            directories,
        );
    }

    private readonly _originName: string;
    private readonly _collection: IImbricateOriginCollection;

    private readonly _directories: string[];

    private constructor(
        originName: string,
        collection: IImbricateOriginCollection,
        directories: string[],
    ) {
        super(directories[directories.length - 1], 1);
        this.contextValue = "page-directory-item";

        this.iconPath = new vscode.ThemeIcon("folder");

        this._originName = originName;
        this._collection = collection;

        this._directories = directories;
    }

    public get originName(): string {
        return this._originName;
    }

    public get collection(): IImbricateOriginCollection {
        return this._collection;
    }

    public get directories(): string[] {
        return this._directories;
    }
}
