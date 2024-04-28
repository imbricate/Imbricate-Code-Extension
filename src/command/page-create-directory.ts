/**
 * @author WMXPY
 * @namespace Command
 * @description Page Create Directory
 */

import { IImbricateOriginCollection, IImbricatePage } from "@imbricate/core";
import { ActiveEditing, createPageSavingTarget, establishImbricateSavingTarget } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { EditingTreeViewDataProvider } from "../editing-tree-view/data-provider";
import { PagesCollectionItem } from "../pages-tree-view/collection-item";
import { PagesTreeViewDataProvider } from "../pages-tree-view/data-provider";
import { showErrorMessage } from "../util/show-message";

export const registerPageCreateDirectoryCommand = (
    editingsDataProvider: EditingTreeViewDataProvider,
    pagesDataProvider: PagesTreeViewDataProvider,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand("imbricate.page.create.directory", async (item: PagesCollectionItem) => {

        let originName: string | null = null;
        let collection: IImbricateOriginCollection | null = null;

        originName = item.originName;
        collection = item.collection;

        if (!originName) {
            showErrorMessage("Cannot find origin name");
            return;
        }

        if (!collection) {
            showErrorMessage("Cannot find collection");
            return;
        }

        const pageTitle: string | undefined = await vscode.window.showInputBox({
            prompt: "Page Title",
        });

        if (!pageTitle) {
            return;
        }

        const page: IImbricatePage = await collection.createPage(
            [], // TODO
            pageTitle,
            "",
        );

        const savingTarget = createPageSavingTarget(
            originName,
            collection.collectionName,
            page.identifier,
        );

        const content: string = "";

        const activeEditing: ActiveEditing = await establishImbricateSavingTarget(
            savingTarget,
            `${page.title}.md`,
            content,
        );

        const textDocument: vscode.TextDocument =
            await vscode.workspace.openTextDocument(activeEditing.path);

        await vscode.window.showTextDocument(textDocument);

        pagesDataProvider.refresh();
        editingsDataProvider.refresh();
    });

    return disposable;
};
