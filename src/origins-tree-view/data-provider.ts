/**
 * @author WMXPY
 * @namespace OriginsTreeView
 * @description Data Provider
 */

import { ImbricateOriginManager, ImbricateOriginManagerOriginResponse } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { logVerbose } from "../util/output-channel";
import { OriginOriginItem } from "./origin-item";

export class OriginsTreeViewDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

    public static async create(
        originManager: ImbricateOriginManager,
    ): Promise<OriginsTreeViewDataProvider> {

        return new OriginsTreeViewDataProvider(
            originManager,
        );
    }

    private readonly _originManager: ImbricateOriginManager;

    private _loaded: boolean = false;

    private _onDidChangeTreeData:
        vscode.EventEmitter<vscode.TreeItem | undefined | void> =
        new vscode.EventEmitter<vscode.TreeItem | undefined | void>();

    public readonly onDidChangeTreeData:
        vscode.Event<vscode.TreeItem | undefined | void> =
        this._onDidChangeTreeData.event;

    private constructor(
        originManager: ImbricateOriginManager,
    ) {

        this._originManager = originManager;
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

                logVerbose("Origin Tree Data Provider Loaded");
                vscode.commands.executeCommand("setContext", "imbricate.context.origins.loaded", true);
            }

            const items: OriginOriginItem[] = this._originManager.origins.map((
                originResponse: ImbricateOriginManagerOriginResponse,
            ) => {

                return OriginOriginItem.create(
                    originResponse.originName,
                    originResponse.origin,
                );
            });

            return Promise.resolve(items);
        }

        return Promise.resolve([
            new vscode.TreeItem("test"),
        ]);
    }
}
