/**
 * @author WMXPY
 * @namespace OriginsTreeView
 * @description Dynamic Origin Item
 */

import { IImbricateOrigin } from "@imbricate/core";
import * as vscode from "vscode";

export class OriginDynamicOriginItem extends vscode.TreeItem {

    public static create(
        originName: string,
        origin: IImbricateOrigin,
    ) {

        return new OriginDynamicOriginItem(originName, origin);
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

        this.contextValue = "dynamic-origin-item";

        this.iconPath = new vscode.ThemeIcon("flame");

        this.tooltip = originName;

        this._origin = origin;
    }

    public get origin(): IImbricateOrigin {
        return this._origin;
    }
}
