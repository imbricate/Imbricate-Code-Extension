/**
 * @author WMXPY
 * @namespace PagesTreeView
 * @description Recent Item
 */

import * as vscode from "vscode";

export class PagesRecentItem extends vscode.TreeItem {

    public static create() {

        return new PagesRecentItem();
    }

    private constructor() {

        super("Recents", 1);

        this.iconPath = new vscode.ThemeIcon("clock");
    }
}
