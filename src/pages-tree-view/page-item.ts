/**
 * @author WMXPY
 * @namespace PagesTreeView
 * @description Page Item
 */

import { IImbricateCollection, ImbricatePageSnapshot } from "@imbricate/core";
import * as vscode from "vscode";

export class PagePageItem extends vscode.TreeItem {

    public static withSnapshot(
        originName: string,
        collection: IImbricateCollection,
        pageSnapshot: ImbricatePageSnapshot,
        variant?: string,
    ) {

        return new PagePageItem(
            originName,
            collection,
            pageSnapshot,
            variant,
        );
    }

    private readonly _originName: string;
    private readonly _collection: IImbricateCollection;

    private readonly _pageSnapshot: ImbricatePageSnapshot;

    private constructor(
        originName: string,
        collection: IImbricateCollection,
        pageSnapshot: ImbricatePageSnapshot,
        variant?: string,
    ) {

        super(pageSnapshot.title, vscode.TreeItemCollapsibleState.None);

        const contextValue: string = typeof variant === "string"
            ? `page-item-${variant}`
            : "page-item";

        this.contextValue = contextValue;

        this.command = {
            command: "imbricate.page.preview",
            title: "Preview Page",
            arguments: [this],
        };

        this._originName = originName;
        this._collection = collection;

        this._pageSnapshot = pageSnapshot;

        this.tooltip = this._buildTooltip();
    }

    public get originName(): string {
        return this._originName;
    }

    public get collection(): IImbricateCollection {
        return this._collection;
    }

    public get pageSnapshot(): ImbricatePageSnapshot {
        return this._pageSnapshot;
    }

    private _buildTooltip(): string {

        return this._originName + " - " + this._collection.collectionName
            + "\n"
            + this._pageSnapshot.directories.join("/") + "/" + this._pageSnapshot.title
            + "\n"
            + this._pageSnapshot.identifier;
    }
}
