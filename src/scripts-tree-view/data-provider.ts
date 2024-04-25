/**
 * @author WMXPY
 * @namespace ScriptsTreeView
 * @description Tree View Data Provider
 */
import { IImbricateOrigin, ImbricateScriptSnapshot } from "@imbricate/core";
import { ImbricateOriginManager } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { IImbricateConfiguration } from "../configuration/definition";
import { IImbricateConfigurationOrigin } from "../configuration/raw-definition";
import { ScriptsOriginItem } from "./origin-item";

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

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
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
                return new vscode.TreeItem(script.scriptName);
            });
        }

        return Promise.resolve([
            new vscode.TreeItem("test"),
        ]);
    }
}
