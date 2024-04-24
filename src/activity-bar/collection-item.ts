/**
 * @author WMXPY
 * @namespace ActivityBar
 * @description Collection Item
 */

import { IImbricateOriginCollection } from "@imbricate/core";
import * as vscode from "vscode";

export class CollectionItem extends vscode.TreeItem {

    public static withCollection(collection: IImbricateOriginCollection) {

        return new CollectionItem(collection);
    }

    private readonly _collection: IImbricateOriginCollection;

    private constructor(
        collection: IImbricateOriginCollection,
    ) {
        super(collection.collectionName, 1);

        this._collection = collection;
    }
}
