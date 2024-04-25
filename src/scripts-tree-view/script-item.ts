/**
 * @author WMXPY
 * @namespace ScriptsTreeView
 * @description Script Item
 */

import { ImbricateScriptSnapshot } from "@imbricate/core";
import * as vscode from "vscode";

export class ScriptScriptItem extends vscode.TreeItem {

    public static withSnapshot(
        scriptSnapshot: ImbricateScriptSnapshot,
    ) {

        return new ScriptScriptItem(scriptSnapshot);
    }

    private readonly _scriptSnapshot: ImbricateScriptSnapshot;

    private constructor(
        scriptSnapshot: ImbricateScriptSnapshot,
    ) {
        super(scriptSnapshot.scriptName, 0);
        this.contextValue = "script-item";

        this._scriptSnapshot = scriptSnapshot;
    }
}
