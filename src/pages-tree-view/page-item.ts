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
    ) {

        return new PagePageItem(
            originName,
            collection,
            pageSnapshot,
        );
    }

    private readonly _originName: string;
    private readonly _collection: IImbricateOriginCollection;

    private readonly _pageSnapshot: ImbricatePageSnapshot;

    private constructor(
        originName: string,
        collection: IImbricateOriginCollection,
        pageSnapshot: ImbricatePageSnapshot,
    ) {
        super(pageSnapshot.title, 0);
        this.contextValue = "page-item";

        this.command = {
            command: 'imbricate.page.preview',
            title: 'Preview Page',
            arguments: [this],
        };

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
