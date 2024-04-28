/**
 * @author WMXPY
 * @namespace ScriptsTreeView
 * @description Script Item
 */

import { IImbricateOrigin, ImbricateScriptSnapshot } from "@imbricate/core";
import * as vscode from "vscode";

export class ScriptScriptItem extends vscode.TreeItem {

    public static withSnapshot(
        originName: string,
        origin: IImbricateOrigin,
        scriptSnapshot: ImbricateScriptSnapshot,
    ) {

        return new ScriptScriptItem(originName, origin, scriptSnapshot);
    }

    private readonly _originName: string;
    private readonly _origin: IImbricateOrigin;

    private readonly _scriptSnapshot: ImbricateScriptSnapshot;

    private constructor(
        originName: string,
        origin: IImbricateOrigin,
        scriptSnapshot: ImbricateScriptSnapshot,
    ) {
        super(scriptSnapshot.scriptName, 0);
        this.contextValue = "script-item";

        this.command = {
            command: "imbricate.script.preview",
            title: "Preview Script",
            arguments: [this],
        };

        this._originName = originName;
        this._origin = origin;

        this._scriptSnapshot = scriptSnapshot;
    }

    public get originName(): string {
        return this._originName;
    }
    public get origin(): IImbricateOrigin {
        return this._origin;
    }

    public get scriptSnapshot(): ImbricateScriptSnapshot {
        return this._scriptSnapshot;
    }
}
