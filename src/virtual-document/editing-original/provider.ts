/**
 * @author WMXPY
 * @namespace VirtualDocument_EditingOriginal
 * @description Provider
 */

import { ActiveEditing, ImbricateOriginManager, readActiveEditing, retrieveImbricateSavingTarget } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { editingOnChangeEmitter } from "../on-change-emitter";

export class EditingOriginalProvider implements vscode.TextDocumentContentProvider {

    public static create(
        originManager: ImbricateOriginManager,
    ): EditingOriginalProvider {

        return new EditingOriginalProvider(originManager);
    }


    private _originManager: ImbricateOriginManager;

    public readonly onDidChangeEmitter;
    public readonly onDidChange;

    private readonly _originalCache: Map<string, string>;

    private constructor(
        originManager: ImbricateOriginManager,
    ) {

        this._originManager = originManager;

        this.onDidChangeEmitter = editingOnChangeEmitter;

        editingOnChangeEmitter.event(this._dismissOriginalCache.bind(this));
        this.onDidChange = editingOnChangeEmitter.event;

        this._originalCache = new Map<string, string>();
    }

    public async provideTextDocumentContent(uri: vscode.Uri): Promise<string> {

        const path: string = uri.path;
        const splited: string[] = path.split("/");

        const identifier: string = splited[0];

        if (!identifier) {
            return "[ERROR] Identifier Not Found!";
        }

        if (this._originalCache.has(identifier)) {
            return this._originalCache.get(identifier) as string;
        }

        const activeEditings: ActiveEditing[] = await readActiveEditing();

        const editing: ActiveEditing | undefined = activeEditings.find((each: ActiveEditing) => {
            return each.identifier === identifier;
        });

        if (!editing) {
            return "[ERROR] Editing Not Found!";
        }

        const originalContent = await retrieveImbricateSavingTarget(
            editing.target,
            this._originManager,
            "[ERROR] Content Not Found!",
        );

        this._originalCache.set(identifier, originalContent);
        return originalContent;
    }

    private _dismissOriginalCache(uri: vscode.Uri): void {

        const path: string = uri.path;
        const splited: string[] = path.split("/");

        const identifier: string = splited[0];

        if (!identifier) {
            return;
        }

        this._originalCache.delete(identifier);
    }
}
