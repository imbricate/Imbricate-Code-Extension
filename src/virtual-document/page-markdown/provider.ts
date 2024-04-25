/**
 * @author WMXPY
 * @namespace VirtualDocument_PageMarkdown
 * @description Provider
 */

import { IImbricateOrigin, IImbricateOriginCollection, IImbricatePage } from "@imbricate/core";
import { ImbricateOriginManager } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { onChangeEmitter } from "../on-change-emitter";

export class PageMarkdownContentProvider implements vscode.TextDocumentContentProvider {

    public static create(
        originManager: ImbricateOriginManager,
    ): PageMarkdownContentProvider {

        return new PageMarkdownContentProvider(originManager);
    }

    private _originManager: ImbricateOriginManager;

    public readonly onDidChangeEmitter;
    public readonly onDidChange;

    private constructor(
        originManager: ImbricateOriginManager,
    ) {

        this._originManager = originManager;

        this.onDidChangeEmitter = onChangeEmitter;
        this.onDidChange = onChangeEmitter.event;
    }

    public async provideTextDocumentContent(uri: vscode.Uri): Promise<string> {

        const path: string = uri.path;
        const splited: string[] = path.split("/");

        const originName: string = splited[0];
        const collectionName: string = splited[1];
        const identifier: string = splited[2];

        const origin: IImbricateOrigin | null = this._originManager.getOrigin(originName);

        if (!origin) {
            return "[ERROR] Origin Not Found!";
        }

        const collection: IImbricateOriginCollection | null = await origin.getCollection(collectionName);

        if (!collection) {
            return "[ERROR] Collection Not Found!";
        }

        const page: IImbricatePage | null = await collection.getPage(identifier);

        if (!page) {
            return "[ERROR] Page Not Found!";
        }

        const content: string = await page.readContent();

        return content;
    }
}
