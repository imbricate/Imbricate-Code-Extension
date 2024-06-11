/**
 * @author WMXPY
 * @namespace OriginsTreeView
 * @description Origin Item
 */

import { IImbricateOrigin } from "@imbricate/core";
import * as vscode from "vscode";

export class OriginOriginItem extends vscode.TreeItem {

    public static create(
        originName: string,
        origin: IImbricateOrigin,
    ) {

        return new OriginOriginItem(originName, origin);
    }

    private readonly _origin: IImbricateOrigin;

    private constructor(
        originName: string,
        origin: IImbricateOrigin,
    ) {

        super(
            originName,
            vscode.TreeItemCollapsibleState.None,
        );

        this.contextValue = "origin-item";
        this.tooltip = originName;

        this._origin = origin;
    }

    public get origin(): IImbricateOrigin {
        return this._origin;
    }
}
