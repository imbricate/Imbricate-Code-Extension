/**
 * @author WMXPY
 * @namespace Command
 * @description Page Copy Identifier
 */

import * as vscode from "vscode";
import { PagePageItem } from "../pages-tree-view/page-item";

export const registerPageCopyIdentifierCommand = (): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.page.copy.identifier", async (
            item: PagePageItem,
        ) => {

        await vscode.env.clipboard.writeText(
            item.pageSnapshot.identifier,
        );
    });

    return disposable;
};
