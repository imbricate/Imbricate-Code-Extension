/**
 * @author WMXPY
 * @namespace PagesTreeView
 * @description Collection Item
 */

import { IImbricateOriginCollection } from "@imbricate/core";
import * as vscode from "vscode";

export class PagesCollectionItem extends vscode.TreeItem {

    public static withCollection(
        originName: string,
        collection: IImbricateOriginCollection,
    ) {

        return new PagesCollectionItem(
            originName,
            collection,
        );
    }

    private readonly _originName: string;

    private readonly _collection: IImbricateOriginCollection;

    private constructor(
        originName: string,
        collection: IImbricateOriginCollection,
    ) {
        super(collection.collectionName, 1);

        let contextValue = "page-collection-item";
        if (collection.includeInSearch) {
            contextValue = "page-collection-item-include";
        } else {
            contextValue = "page-collection-item-exclude";
        }
        this.contextValue = contextValue;

        this.iconPath = new vscode.ThemeIcon("default-view-icon");

        this._originName = originName;

        this._collection = collection;
    }

    public get originName(): string {
        return this._originName;
    }

    public get collection(): IImbricateOriginCollection {
        return this._collection;
    }
}
