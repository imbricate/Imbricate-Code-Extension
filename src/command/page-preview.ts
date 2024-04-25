/**
 * @author WMXPY
 * @namespace Command
 * @description Page Preview
 */

import * as vscode from "vscode";
import { PagePageItem } from "../pages-tree-view/page-item";
import { showInformationMessage } from "../util/show-message";
import { concatPageMarkdownUrl } from "../virtual-document/page-markdown/concat";

export const registerPagePreviewCommand = (): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand("imbricate.page.preview", async (item: PagePageItem) => {

        const uri = concatPageMarkdownUrl(
            item.originName,
            item.collection.collectionName,
            item.pageSnapshot.identifier,
        );

        const textDocument: vscode.TextDocument =
            await vscode.workspace.openTextDocument(uri);

        await vscode.window.showTextDocument(textDocument);

        showInformationMessage(`Previewing page: ${item.pageSnapshot.title}`);
    });

    return disposable;
};
