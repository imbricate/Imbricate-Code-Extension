/**
 * @author WMXPY
 * @namespace EditingTreeView
 * @description Data Provider
 */

import { ActiveEditing, IImbricateConfiguration, readActiveEditing } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { EditingEditingItem } from "./editing-item";

export class EditingTreeViewDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

    public static async create(
        configuration: IImbricateConfiguration,
    ): Promise<EditingTreeViewDataProvider> {

        return new EditingTreeViewDataProvider(
            configuration,
        );
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

    public refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    public getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: vscode.TreeItem): Promise<vscode.TreeItem[]> {

        if (typeof element === "undefined") {

            const activeEditings: ActiveEditing[] = await readActiveEditing();

            return activeEditings.map((activeEditing: ActiveEditing) => {
                return EditingEditingItem.withActiveEditing(activeEditing);
            });
        }

        return Promise.resolve([
            new vscode.TreeItem("test"),
        ]);
    }
}
