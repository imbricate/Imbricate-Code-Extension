/**
 * @author WMXPY
 * @namespace ScriptsTreeView
 * @description Dynamic Origin Item
 */

import { IImbricateOrigin } from "@imbricate/core";
import * as vscode from "vscode";

export class ScriptsDynamicOriginItem extends vscode.TreeItem {

    public static withOrigin(
        originName: string,
        origin: IImbricateOrigin,
    ) {

        return new ScriptsDynamicOriginItem(originName, origin);
    }

    private readonly _originName: string;
    private readonly _origin: IImbricateOrigin;

    private constructor(
        originName: string,
        origin: IImbricateOrigin,
    ) {

        super(originName, vscode.TreeItemCollapsibleState.Collapsed);

        this.contextValue = "script-dynamic-origin-item";

        this.iconPath = new vscode.ThemeIcon("flame");

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
