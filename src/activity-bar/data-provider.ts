/**
 * @author WMXPY
 * @namespace ActivityBar
 * @description Sidebar
 */
import * as vscode from "vscode";
import { IImbricateConfiguration } from "../configuration/definition";
import { readCLIConfiguration } from "../configuration/io";
import { resolveImbricateHomeDirectory } from "../util/directory-resolve";
import { CollectionItem } from "./collection-item";

export class ImbricateActivityDataProvider implements vscode.TreeDataProvider<CollectionItem> {

    public static async fromHomeConfig(): Promise<ImbricateActivityDataProvider> {

        const configurationPath: string = resolveImbricateHomeDirectory();
        const configuration = await readCLIConfiguration(configurationPath);

        return new ImbricateActivityDataProvider(configuration);
    }

    private readonly _configuration: IImbricateConfiguration;

    private _onDidChangeTreeData:
        vscode.EventEmitter<CollectionItem | undefined | void> =
        new vscode.EventEmitter<CollectionItem | undefined | void>();

    public readonly onDidChangeTreeData:
        vscode.Event<CollectionItem | undefined | void> =
        this._onDidChangeTreeData.event;

    private constructor(
        configuration: IImbricateConfiguration,
    ) {

        this._configuration = configuration;
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
