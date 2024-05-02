/**
 * @author WMXPY
 * @namespace PagesTreeView
 * @description Page Item
 */

import { IImbricateOriginCollection, ImbricatePageSnapshot } from "@imbricate/core";
import * as vscode from "vscode";

export class PagePageItem extends vscode.TreeItem {

    public static withSnapshot(
        originName: string,
        collection: IImbricateOriginCollection,
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
    private readonly _collection: IImbricateOriginCollection;

    private readonly _pageSnapshot: ImbricatePageSnapshot;

    private constructor(
        originName: string,
        collection: IImbricateOriginCollection,
        pageSnapshot: ImbricatePageSnapshot,
        variant?: string,
    ) {
        super(pageSnapshot.title, 0);

        const contextValue: string = typeof variant === "string"
            ? `page-item-${variant}`
            : "page-item";

        this.contextValue = contextValue;

        this.command = {
            command: "imbricate.page.preview",
            title: "Preview Page",
            arguments: [this],
        };

        this.tooltip = pageSnapshot.identifier;

        this._originName = originName;
        this._collection = collection;

        this._pageSnapshot = pageSnapshot;
    }

    public get originName(): string {
        return this._originName;
    }

    public get collection(): IImbricateOriginCollection {
        return this._collection;
    }

    public get pageSnapshot(): ImbricatePageSnapshot {
        return this._pageSnapshot;
    }
}
