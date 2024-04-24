/**
 * @author WMXPY
 * @namespace ActivityBar
 * @description Sidebar
 */
import * as vscode from "vscode";
import { readCLIConfiguration } from "../configuration/io";
import { resolveImbricateHomeDirectory } from "../util/directory-resolve";
import { CollectionItem } from "./collection-item";

export class ImbricateActivityDataProvider implements vscode.TreeDataProvider<CollectionItem> {

    private _onDidChangeTreeData:
        vscode.EventEmitter<CollectionItem | undefined | void> =
        new vscode.EventEmitter<CollectionItem | undefined | void>();

    readonly onDidChangeTreeData:
        vscode.Event<CollectionItem | undefined | void> =
        this._onDidChangeTreeData.event;

    constructor() {

        const configurationPath: string = resolveImbricateHomeDirectory();

        readCLIConfiguration(configurationPath);
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: CollectionItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: CollectionItem): Thenable<CollectionItem[]> {

        console.log("getChildren", element);
        return Promise.resolve([
            new CollectionItem(),
            new CollectionItem(),
            new CollectionItem(),
        ]);
    }
}
