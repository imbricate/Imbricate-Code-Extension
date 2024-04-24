/**
 * @author WMXPY
 * @namespace ActivityBar
 * @description Origin Item
 */

import { IImbricateOrigin } from "@imbricate/core";
import * as vscode from "vscode";

export class OriginItem extends vscode.TreeItem {

    public static withOrigin(
        originName: string,
        origin: IImbricateOrigin,
    ) {

        return new OriginItem(originName, origin);
    }

    private readonly _originName: string;
    private readonly _origin: IImbricateOrigin;

    private constructor(
        originName: string,
        origin: IImbricateOrigin,
    ) {

        super(originName, 1);

        this._originName = originName;
        this._origin = origin;
    }

    public get origin(): IImbricateOrigin {
        return this._origin;
    }
}
