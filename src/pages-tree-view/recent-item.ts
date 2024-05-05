/**
 * @author WMXPY
 * @namespace PagesTreeView
 * @description Recent Item
 */

import { IImbricateOrigin, IImbricateOriginCollection } from "@imbricate/core";
import { ImbricateOriginManager } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { PAGES_RECENTS_KEY, PagePersistanceData } from "./page-data";
import { PagePageItem } from "./page-item";

export class PagesRecentItem extends vscode.TreeItem {

    public static create() {

        return new PagesRecentItem();
    }

    private constructor() {

        super("Recents", vscode.TreeItemCollapsibleState.Collapsed);

        this.contextValue = "page-recent";

        this.iconPath = new vscode.ThemeIcon("clock");

        this.tooltip = "Recent Pages";
    }
}

export const renderPageRecentItem = async (
    originManager: ImbricateOriginManager,
    context: vscode.ExtensionContext,
): Promise<vscode.TreeItem[]> => {

    const recentItems: PagePersistanceData[] | undefined = context.globalState.get(PAGES_RECENTS_KEY);

    if (!recentItems) {
        return [];
    }

    const treeItems: vscode.TreeItem[] = [];

    for (const recent of recentItems) {

        const origin: IImbricateOrigin | null = originManager.getOrigin(recent.originName);

        if (!origin) {

            treeItems.push(
                new vscode.TreeItem("ERROR, Origin Not Found"),
            );
            continue;
        }

        const collection: IImbricateOriginCollection | null = await origin.getCollection(recent.collectionName);

        if (!collection) {

            treeItems.push(
                new vscode.TreeItem("ERROR, Collection Not Found"),
            );
            continue;
        }

        const result = PagePageItem.withSnapshot(
            recent.originName,
            collection,
            recent.pageSnapshot,
            "recent",
        );

        treeItems.push(result);
    }

    return treeItems;
};
