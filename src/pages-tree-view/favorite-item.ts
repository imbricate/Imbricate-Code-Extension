/**
 * @author WMXPY
 * @namespace PagesTreeView
 * @description Favorite Item
 */

import { IImbricateOrigin, IImbricateOriginCollection } from "@imbricate/core";
import { ImbricateOriginManager } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { PAGES_FAVORITES_KEY, PagePersistanceData } from "./page-data";
import { PagePageItem } from "./page-item";

export class PagesFavoriteItem extends vscode.TreeItem {

    public static create() {

        return new PagesFavoriteItem();
    }

    private constructor() {

        super("Favorites", vscode.TreeItemCollapsibleState.Collapsed);

        this.iconPath = new vscode.ThemeIcon("star");

        this.tooltip = "Favorite Pages";
    }
}

export const renderPageFavoriteItem = async (
    originManager: ImbricateOriginManager,
    context: vscode.ExtensionContext,
): Promise<vscode.TreeItem[]> => {

    const favoriteItems: PagePersistanceData[] | undefined = context.globalState.get(PAGES_FAVORITES_KEY);

    if (!favoriteItems) {
        return [];
    }

    const treeItems: vscode.TreeItem[] = [];

    for (const favorite of favoriteItems) {

        const origin: IImbricateOrigin | null = originManager.getOrigin(favorite.originName);

        if (!origin) {

            treeItems.push(
                new vscode.TreeItem("ERROR, Origin Not Found"),
            );
            continue;
        }

        const collection: IImbricateOriginCollection | null = await origin.getCollection(favorite.collectionName);

        if (!collection) {

            treeItems.push(
                new vscode.TreeItem("ERROR, Collection Not Found"),
            );
            continue;
        }

        const result = PagePageItem.withSnapshot(
            favorite.originName,
            collection,
            favorite.pageSnapshot,
            "favorite",
        );

        treeItems.push(result);
    }

    return treeItems;
};
