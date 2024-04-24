/**
 * @author WMXPY
 * @namespace ActivityBar
 * @description Origin Item
 */

import * as vscode from "vscode";

export class OriginItem extends vscode.TreeItem {

    constructor() {
        super("Hello World Origin", 1);
    }
}
