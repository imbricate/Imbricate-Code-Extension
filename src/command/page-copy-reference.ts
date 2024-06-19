/**
 * @author WMXPY
 * @namespace Command
 * @description Page Copy Reference
 */

import * as vscode from "vscode";
import { PagePageItem } from "../pages-tree-view/page-item";

export const registerPageCopyReferenceCommand = (): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.page.copy.reference", async (
            item: PagePageItem,
        ) => {

        const trace: string = [
            item.originName,
            item.collection.uniqueIdentifier,
            item.pageSnapshot.identifier,
        ].join(":");

        const reference: string = `_#${trace}_`;

        await vscode.env.clipboard.writeText(
            reference,
        );
    });

    return disposable;
};
