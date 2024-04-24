/**
 * @author WMXPY
 * @namespace ActivityBar
 * @description Sidebar
 */
import * as vscode from "vscode";
import { IImbricateConfiguration } from "../configuration/definition";
import { readCLIConfiguration } from "../configuration/io";
import { IImbricateConfigurationOrigin } from "../configuration/raw-definition";
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

            const items: OriginItem[] = this._configuration.origins.map((
                origin: IImbricateConfigurationOrigin,
            ) => {
                return OriginItem.withOriginConfig(origin);
            });

            return Promise.resolve(items);
        }

        return Promise.resolve([
            new CollectionItem(),
        ]);
    }
}
