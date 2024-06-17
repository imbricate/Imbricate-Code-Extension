/**
 * @author WMXPY
 * @namespace PagesTreeView
 * @description Dynamic Origin Item
 */

import { IImbricateOrigin } from "@imbricate/core";
import * as vscode from "vscode";

export class PagesDynamicOriginItem extends vscode.TreeItem {

    public static withOrigin(
        originName: string,
        origin: IImbricateOrigin,
    ) {

        return new PagesDynamicOriginItem(originName, origin);
    }

    private readonly _originName: string;
    private readonly _origin: IImbricateOrigin;

    private constructor(
        originName: string,
        origin: IImbricateOrigin,
    ) {

        super(originName, vscode.TreeItemCollapsibleState.Collapsed);

        this.contextValue = "page-dynamic-origin-item";

        this.iconPath = new vscode.ThemeIcon("flame");

        this._originName = originName;
        this._origin = origin;

        const tooltipLines: string[] = [
            "Dynamic Origin",
            `Origin: ${this._originName}`,
            `Type: ${this._origin.originType}`,
            `Unique Identifier: ${this._origin.uniqueIdentifier}`,
        ];

        this.tooltip = tooltipLines.join("\n");
    }

    public get originName(): string {
        return this._originName;
    }

    public get origin(): IImbricateOrigin {
        return this._origin;
    }
}
