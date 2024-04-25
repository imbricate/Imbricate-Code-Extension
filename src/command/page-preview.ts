/**
 * @author WMXPY
 * @namespace Command
 * @description Page Preview
 */

import * as vscode from "vscode";
import { PagePageItem } from "../pages-tree-view/page-item";
import { showInformationMessage } from "../util/show-message";

export const registerPagePreviewCommand = (): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand("imbricate.page.preview", async (item: PagePageItem) => {

        const uri = vscode.Uri.parse(`imbricate-page-markdown:${item.originName}/${item.collection.collectionName}/${item.pageSnapshot.identifier}/${item.pageSnapshot.title}.md`);

        const textDocument: vscode.TextDocument =
            await vscode.workspace.openTextDocument(uri);

        await vscode.window.showTextDocument(textDocument);

        showInformationMessage(`Previewing page: ${item.pageSnapshot.title}`);
    });

    return disposable;
};
