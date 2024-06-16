/**
 * @author WMXPY
 * @namespace Command
 * @description Page Copy Trace
 */

import * as vscode from "vscode";
import { PagePageItem } from "../pages-tree-view/page-item";

export const registerPageCopyTraceCommand = (): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.page.copy.trace", async (
            item: PagePageItem,
        ) => {

        const trace: string = [
            item.originName,
            item.collection.uniqueIdentifier,
            item.pageSnapshot.identifier,
        ].join(":");

        await vscode.env.clipboard.writeText(
            trace,
        );
    });

    return disposable;
};
