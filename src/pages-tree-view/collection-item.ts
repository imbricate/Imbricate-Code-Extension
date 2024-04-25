/**
 * @author WMXPY
 * @namespace PagesTreeView
 * @description Collection Item
 */

import { IImbricateOriginCollection } from "@imbricate/core";
import * as vscode from "vscode";

export class PagesCollectionItem extends vscode.TreeItem {

    public static withCollection(collection: IImbricateOriginCollection) {

        return new PagesCollectionItem(collection);
    }

    private readonly _collection: IImbricateOriginCollection;

    private constructor(
        collection: IImbricateOriginCollection,
    ) {
        super(collection.collectionName, 1);

        this._collection = collection;
    }

    public get collection(): IImbricateOriginCollection {
        return this._collection;
    }
}
