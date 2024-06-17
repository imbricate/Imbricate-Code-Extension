/**
 * @author WMXPY
 * @namespace Command
 * @description Page Create
 */

import { IImbricateCollection, IImbricatePage } from "@imbricate/core";
import { ActiveEditing, ImbricateOriginManager, createPageSavingTarget, establishImbricateSavingTarget, validateFilename } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { EditingTreeViewDataProvider } from "../editing-tree-view/data-provider";
import { PagesCollectionItem } from "../pages-tree-view/collection-item";
import { PagesTreeViewDataProvider } from "../pages-tree-view/data-provider";
import { PageDirectoryItem } from "../pages-tree-view/directory-item";
import { PagePersistanceData } from "../pages-tree-view/page-data";
import { recordRecentPage } from "../util/recent";
import { showErrorMessage } from "../util/show-message";

export const registerPageCreateCommand = (
    originManager: ImbricateOriginManager,
    editingsDataProvider: EditingTreeViewDataProvider,
    pagesDataProvider: PagesTreeViewDataProvider,
    context: vscode.ExtensionContext,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.page.create", async (
            item: PagesCollectionItem | PageDirectoryItem,
        ) => {

        let originName: string | null = null;
        let collection: IImbricateCollection | null = null;
        let directories: string[] = [];

        if (item instanceof PageDirectoryItem) {
            directories = item.directories;
        }

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
            title: "Create Page",
            prompt: "Page Title...",
            validateInput: (value: string) => {

                const validateResult: string | null = validateFilename(value);
                if (typeof validateResult === "string") {
                    return validateResult;
                }
                return undefined;
            },
        });

        if (!pageTitle) {
            return;
        }

        const content: string = "";

        const page: IImbricatePage = await collection.createPage(
            directories,
            pageTitle,
            content,
        );

        const savingTarget = createPageSavingTarget(
            originName,
            collection.uniqueIdentifier,
            page.identifier,
        );

        const activeEditing: ActiveEditing = await establishImbricateSavingTarget(
            savingTarget,
            `${page.title}.md`,
            content,
        );

        const textDocument: vscode.TextDocument =
            await vscode.workspace.openTextDocument(activeEditing.path);

        await vscode.window.showTextDocument(textDocument);

        const persistanceData: PagePersistanceData = {
            originName: item.originName,
            collectionUniqueIdentifier: item.collection.uniqueIdentifier,
            pageSnapshot: {
                identifier: page.identifier,
                title: page.title,
                directories: directories,
            },
        };

        await recordRecentPage(
            originManager,
            persistanceData,
            pagesDataProvider,
            context,
            false,
        );

        pagesDataProvider.refresh();
        editingsDataProvider.refresh();
    });

    return disposable;
};
