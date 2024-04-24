/**
 * @author WMXPY
 * @namespace ActivityBar
 * @description Origin Item
 */

import * as vscode from "vscode";
import { IImbricateConfigurationOrigin } from "../configuration/raw-definition";

export class OriginItem extends vscode.TreeItem {

    public static withOriginConfig(
        originConfig: IImbricateConfigurationOrigin,
    ) {

        return new OriginItem(originConfig);
    }

    private readonly _originConfig: IImbricateConfigurationOrigin;

    private constructor(
        originConfig: IImbricateConfigurationOrigin,
    ) {

        super(originConfig.originName, 1);

        this._originConfig = originConfig;
    }
}
