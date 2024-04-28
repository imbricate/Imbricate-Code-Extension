/**
 * @author WMXPY
 * @namespace PagesTreeView
 * @description Origin Item
 */

import { IImbricateOrigin } from "@imbricate/core";
import * as vscode from "vscode";

export class PagesOriginItem extends vscode.TreeItem {

    public static withOrigin(
        originName: string,
        origin: IImbricateOrigin,
    ) {

        return new PagesOriginItem(originName, origin);
    }

    private readonly _originName: string;
    private readonly _origin: IImbricateOrigin;

    private constructor(
        originName: string,
        origin: IImbricateOrigin,
    ) {

        super(originName, 1);

        this.iconPath = new vscode.ThemeIcon("globe");

        this._originName = originName;
        this._origin = origin;
    }

    public get originName(): string {
        return this._originName;
    }

    public get origin(): IImbricateOrigin {
        return this._origin;
    }
}
