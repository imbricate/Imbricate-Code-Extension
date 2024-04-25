/**
 * @author WMXPY
 * @namespace VirtualDocument_ScriptJavascript
 * @description Provider
 */

import { IImbricateOrigin, IImbricateScript } from "@imbricate/core";
import { ImbricateOriginManager } from "@imbricate/local-fundamental";
import * as vscode from "vscode";

export class ScriptJavascriptContentProvider implements vscode.TextDocumentContentProvider {

    public static create(
        originManager: ImbricateOriginManager,
    ): ScriptJavascriptContentProvider {

        return new ScriptJavascriptContentProvider(originManager);
    }

    private _originManager: ImbricateOriginManager;

    public readonly onDidChangeEmitter;
    public readonly onDidChange;

    private constructor(
        originManager: ImbricateOriginManager,
    ) {

        this._originManager = originManager;

        this.onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
        this.onDidChange = this.onDidChangeEmitter.event;
    }

    public async provideTextDocumentContent(uri: vscode.Uri): Promise<string> {

        const path: string = uri.path;
        const splited: string[] = path.split("/");

        const originName: string = splited[0];
        const identifier: string = splited[1];

        const origin: IImbricateOrigin | null = this._originManager.getOrigin(originName);

        if (!origin) {
            return "[ERROR] Origin Not Found!";
        }

        const script: IImbricateScript | null = await origin.getScript(identifier);

        if (!script) {
            return "[ERROR] Script Not Found!";
        }

        const content: string = await script.readScript();

        return content;
    }
}
