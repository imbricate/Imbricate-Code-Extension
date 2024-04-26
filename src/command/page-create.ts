/**
 * @author WMXPY
 * @namespace Command
 * @description Page Create
 */

import { IImbricateOriginCollection, IImbricatePage } from "@imbricate/core";
import { ActiveEditing, ImbricateOriginManager, createPageSavingTarget, establishImbricateSavingTarget } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { EditingTreeViewDataProvider } from "../editing-tree-view/data-provider";
import { PagesCollectionItem } from "../pages-tree-view/collection-item";
import { showErrorMessage } from "../util/show-message";
import { PagesTreeViewDataProvider } from "../pages-tree-view/data-provider";

export const registerPageCreateCommand = (
    editingsDataProvider: EditingTreeViewDataProvider,
    pagesDataProvider: PagesTreeViewDataProvider,
    originManager: ImbricateOriginManager,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand("imbricate.page.create", async (item?: PagesCollectionItem) => {

        let originName: string | null = null;
        let collection: IImbricateOriginCollection | null = null;
        if (typeof item === "undefined") {

            const targetOriginName: string | undefined = await vscode.window.showInputBox({
                prompt: "Origin Name",
            });

            if (!targetOriginName) {
                return;
            }

            originName = targetOriginName;
            const origin = originManager.getOrigin(targetOriginName);

            if (!origin) {
                showErrorMessage(`Cannot find origin: ${targetOriginName}`);
                return;
            }

            const collectionName: string | undefined = await vscode.window.showInputBox({
                prompt: "Collection Name",
            });

            if (!collectionName) {
                return;
            }

            const targetCollection = await origin.getCollection(collectionName);

            if (!targetCollection) {
                showErrorMessage(`Cannot find collection: ${collectionName}`);
                return;
            }

            collection = targetCollection;
        } else {

            originName = item.originName;
            collection = item.collection;
        }

        if (!originName) {
            showErrorMessage(`Cannot find origin name`);
            return;
        }

        if (!collection) {
            showErrorMessage(`Cannot find collection`);
            return;
        }

        const pageTitle: string | undefined = await vscode.window.showInputBox({
            prompt: "Page Title",
        });

        if (!pageTitle) {
            return;
        }

        const page: IImbricatePage = await collection.createPage(
            pageTitle,
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
