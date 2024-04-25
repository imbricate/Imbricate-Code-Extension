/**
 * @author WMXPY
 * @namespace ScriptsTreeView
 * @description Data Provider
 */

import { IImbricateOrigin, ImbricateScriptSnapshot } from "@imbricate/core";
import { IImbricateConfiguration, IImbricateConfigurationOrigin, ImbricateOriginManager } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { ScriptsOriginItem } from "./origin-item";
import { ScriptScriptItem } from "./script-item";

export class ScriptsTreeViewDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

    public static async create(
        configuration: IImbricateConfiguration,
        originManager: ImbricateOriginManager,
    ): Promise<ScriptsTreeViewDataProvider> {

        return new ScriptsTreeViewDataProvider(
            configuration,
            originManager,
        );
    }

    private readonly _configuration: IImbricateConfiguration;
    private readonly _originManager: ImbricateOriginManager;

    private _onDidChangeTreeData:
        vscode.EventEmitter<vscode.TreeItem | undefined | void> =
        new vscode.EventEmitter<vscode.TreeItem | undefined | void>();

    public readonly onDidChangeTreeData:
        vscode.Event<vscode.TreeItem | undefined | void> =
        this._onDidChangeTreeData.event;

    private constructor(
        configuration: IImbricateConfiguration,
        originManager: ImbricateOriginManager,
    ) {

        this._configuration = configuration;
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

            const items: vscode.TreeItem[] = this._configuration.origins.map((
                originConfig: IImbricateConfigurationOrigin,
            ) => {

                const origin: IImbricateOrigin | null =
                    this._originManager.getOrigin(originConfig.originName);

                if (!origin) {
                    return new vscode.TreeItem("test");
                }

                return ScriptsOriginItem.withOrigin(
                    originConfig.originName,
                    origin,
                );
            });

            return Promise.resolve(items);
        }

        if (element instanceof ScriptsOriginItem) {

            const scripts: ImbricateScriptSnapshot[] =
                await element.origin.listScripts();

            return scripts.map((script: ImbricateScriptSnapshot) => {
                return ScriptScriptItem.withSnapshot(script);
            });
        }

        return Promise.resolve([
            new vscode.TreeItem("test"),
        ]);
    }
}
