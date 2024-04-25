/**
 * @author WMXPY
 * @namespace PagesTreeView
 * @description Page Item
 */

import { ImbricatePageSnapshot } from "@imbricate/core";
import * as vscode from "vscode";

export class PagePageItem extends vscode.TreeItem {

    public static withSnapshot(
        pageSnapshot: ImbricatePageSnapshot,
    ) {

        return new PagePageItem(pageSnapshot);
    }

    private readonly _pageSnapshot: ImbricatePageSnapshot;

    private constructor(
        pageSnapshot: ImbricatePageSnapshot,
    ) {
        super(pageSnapshot.title, 0);
        this.contextValue = "page-item";

        this._pageSnapshot = pageSnapshot;
    }
}
