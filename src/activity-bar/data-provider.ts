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
import { OriginItem } from "./origin-item";

export class ImbricateActivityDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

    public static async fromHomeConfig(): Promise<ImbricateActivityDataProvider> {

        const configurationPath: string = resolveImbricateHomeDirectory();
        const configuration = await readCLIConfiguration(configurationPath);

        return new ImbricateActivityDataProvider(configuration);
    }

    private readonly _configuration: IImbricateConfiguration;

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
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {

        if (typeof element === "undefined") {
            return Promise.resolve(
                this._configuration.origins.map((origin: any) => {
                    return new OriginItem();
                }),
            );
        }

        return Promise.resolve([
            new CollectionItem(),
        ]);
    }
}
