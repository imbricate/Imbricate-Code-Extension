/**
 * @author WMXPY
 * @namespace PagesTreeView
 * @description Favorite Item
 */

import * as vscode from "vscode";

export class PagesFavoriteItem extends vscode.TreeItem {

    public static create() {

        return new PagesFavoriteItem();
    }

    private constructor() {

        super("Favorites", 1);

        this.iconPath = new vscode.ThemeIcon("star");
    }
}

export const renderPageFavoriteItem = async (
    context: vscode.ExtensionContext,
): Promise<vscode.TreeItem[]> => {

    // console.log(context.globalState.update('imbricate', 'imbricate'));

    return [];
};
