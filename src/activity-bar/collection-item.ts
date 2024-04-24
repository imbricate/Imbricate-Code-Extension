/**
 * @author WMXPY
 * @namespace ActivityBar
 * @description Collection Item
 */

import * as vscode from "vscode";

export class CollectionItem extends vscode.TreeItem {

    constructor() {
        super("Hello World", 1);
    }
}
