/**
 * @author WMXPY
 * @namespace Command
 * @description Page Edit
 */

import { IImbricatePage } from "@imbricate/core";
import { ActiveEditing, createPageSavingTarget, establishImbricateSavingTarget } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { PagePageItem } from "../pages-tree-view/page-item";
import { showErrorMessage } from "../util/show-message";

export const registerPageEditCommand = (): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand("imbricate.page.edit", async (item: PagePageItem) => {

        const savingTarget = createPageSavingTarget(
            item.originName,
            item.collection.collectionName,
            item.pageSnapshot.identifier,
        );

        const page: IImbricatePage | null =
            await item.collection.getPage(item.pageSnapshot.identifier);

        if (!page) {
            showErrorMessage(`Cannot find page: ${item.pageSnapshot.title}`);
            return;
        }

        const content: string = await page.readContent();

        const activeEditing: ActiveEditing = await establishImbricateSavingTarget(
            savingTarget,
            `${item.pageSnapshot.title}.md`,
            content,
        );
    });

    return disposable;
};
