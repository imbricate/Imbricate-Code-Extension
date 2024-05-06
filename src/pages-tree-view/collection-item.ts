/**
 * @author WMXPY
 * @namespace PagesTreeView
 * @description Collection Item
 */

import { IImbricateOriginCollection } from "@imbricate/core";
import { ImbricateSearchPreference, IncludedSearchPreference } from "@imbricate/local-fundamental";
import * as vscode from "vscode";

export class PagesCollectionItem extends vscode.TreeItem {

    public static withCollection(
        originName: string,
        collection: IImbricateOriginCollection,
        searchPreference: ImbricateSearchPreference,
    ) {

        return new PagesCollectionItem(
            originName,
            collection,
            searchPreference,
        );
    }

    private readonly _originName: string;

    private readonly _collection: IImbricateOriginCollection;

    private constructor(
        originName: string,
        collection: IImbricateOriginCollection,
        searchPreference: ImbricateSearchPreference,
    ) {

        super(collection.collectionName, vscode.TreeItemCollapsibleState.Collapsed);

        this.contextValue = this._buildContextValue(
            originName,
            collection,
            searchPreference,
        );

        this.iconPath = new vscode.ThemeIcon("default-view-icon");

        this._originName = originName;

        this._collection = collection;

        const tooltipLines: string[] = [
            `Collection: ${this._originName} - ${collection.collectionName}`,
            `Unique Identifier: ${collection.uniqueIdentifier}`,
        ];

        if (this._collection.description) {
            tooltipLines.push(this._collection.description);
        }

        this.tooltip = tooltipLines.join("\n");
    }

    public get originName(): string {
        return this._originName;
    }

    public get collection(): IImbricateOriginCollection {
        return this._collection;
    }

    private _buildContextValue(
        originName: string,
        collection: IImbricateOriginCollection,
        searchPreference: ImbricateSearchPreference,
    ): string {

        const includedInSearch = searchPreference.included.some((item: IncludedSearchPreference) => {
            return item.originName === originName &&
                item.collectionUniqueIdentifier === collection.uniqueIdentifier;
        });

        if (includedInSearch) {
            return "page-collection-item-include";
        }
        return "page-collection-item-exclude";
    }
}
