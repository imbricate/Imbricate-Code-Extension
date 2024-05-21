/**
 * @author WMXPY
 * @namespace HistoryTreeView
 * @description Data Provider
 */

import { ImbricatePageHistoryRecord, ImbricateScriptHistoryRecord } from "@imbricate/core";
import { IImbricateConfiguration } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { logVerbose } from "../util/output-channel";
import { HistoryRecordItem } from "./record-item";

export class HistoryTreeViewDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

    public static async create(
        configuration: IImbricateConfiguration,
    ): Promise<HistoryTreeViewDataProvider> {

        return new HistoryTreeViewDataProvider(
            configuration,
        );
    }

    private readonly _configuration: IImbricateConfiguration;
    private _currentRecords: Array<ImbricatePageHistoryRecord | ImbricateScriptHistoryRecord> | null;

    private _loaded: boolean = false;

    private _onDidChangeTreeData:
        vscode.EventEmitter<vscode.TreeItem | undefined | void> =
        new vscode.EventEmitter<vscode.TreeItem | undefined | void>();

    public readonly onDidChangeTreeData:
        vscode.Event<vscode.TreeItem | undefined | void> =
        this._onDidChangeTreeData.event;

    private constructor(
        configuration: IImbricateConfiguration,
    ) {

        this._configuration = configuration;
        this._currentRecords = null;
    }

    public showRecords(records: Array<ImbricatePageHistoryRecord | ImbricateScriptHistoryRecord>): void {

        this._currentRecords = records;
        this.refresh();
    }

    public refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    public getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: vscode.TreeItem): Promise<vscode.TreeItem[]> {

        if (typeof element === "undefined") {

            if (!this._loaded) {

                this._loaded = true;

                logVerbose("History Tree Data Provider Loaded");
                vscode.commands.executeCommand("setContext", "imbricate.context.histories.loaded", true);
            }

            if (this._currentRecords === null) {
                return [];
            }

            const items: HistoryRecordItem[] = this._currentRecords.map(
                (record: ImbricatePageHistoryRecord | ImbricateScriptHistoryRecord) => {

                    return HistoryRecordItem.withRecord(record);
                },
            );

            return Promise.resolve(items);
        }

        return Promise.resolve([
            new vscode.TreeItem("test"),
        ]);
    }
}
