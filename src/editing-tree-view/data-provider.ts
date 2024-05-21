/**
 * @author WMXPY
 * @namespace EditingTreeView
 * @description Data Provider
 */

import { ActiveEditing, IImbricateConfiguration, readActiveEditing } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { logVerbose } from "../util/output-channel";
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

            const items: EditingEditingItem[] =
                activeEditings.map((activeEditing: ActiveEditing) => {
                    return EditingEditingItem.withActiveEditing(activeEditing);
                });

            if (!this._loaded) {

                this._loaded = true;

                logVerbose("Editings Tree Data Provider Loaded");
                vscode.commands.executeCommand("setContext", "imbricate.context.editings.loaded", true);
            }

            return Promise.resolve(items);
        }

        return Promise.resolve([
            new vscode.TreeItem("test"),
        ]);
    }
}
