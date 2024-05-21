/**
 * @author WMXPY
 * @namespace HistoryTreeView
 * @description Record Item
 */

import { ImbricatePageHistoryRecord, ImbricateScriptHistoryRecord } from "@imbricate/core";
import * as vscode from "vscode";

export class HistoryRecordItem extends vscode.TreeItem {

    public static withRecord(
        record: ImbricatePageHistoryRecord | ImbricateScriptHistoryRecord,
    ) {

        return new HistoryRecordItem(record);
    }

    private readonly _record: ImbricatePageHistoryRecord | ImbricateScriptHistoryRecord;

    private constructor(
        record: ImbricatePageHistoryRecord | ImbricateScriptHistoryRecord,
    ) {

        super(record.updatedAt.toLocaleString(), vscode.TreeItemCollapsibleState.None);
        this.contextValue = "history-record-item";

        this.iconPath = new vscode.ThemeIcon("settings-edit");
        // this.command = {
        //     command: "imbricate.editing.resume",
        //     title: "Resume Editing",
        //     arguments: [activeEditing],
        // };

        this._record = record;
    }

    public get record(): ImbricatePageHistoryRecord | ImbricateScriptHistoryRecord {
        return this._record;
    }
}
