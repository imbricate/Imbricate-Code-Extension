/**
 * @author WMXPY
 * @namespace Command
 * @description Page Clone
 */

import { IImbricatePage, ImbricatePageAttributes, ImbricatePageMetadata } from "@imbricate/core";
import { checkSavingTargetActive, createPageSavingTarget } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { PagesTreeViewDataProvider } from "../pages-tree-view/data-provider";
import { PagePageItem } from "../pages-tree-view/page-item";
import { showErrorMessage } from "../util/show-message";
import { UUIDVersion1 } from "@sudoo/uuid";

export const registerPageCloneCommand = (
    pagesDataProvider: PagesTreeViewDataProvider,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.page.clone", async (
            pageItem: PagePageItem,
        ) => {

        const savingTarget = createPageSavingTarget(
            pageItem.originName,
            pageItem.collection.uniqueIdentifier,
            pageItem.pageSnapshot.identifier,
        );

        const isActive: boolean = await checkSavingTargetActive(savingTarget);

        if (isActive) {

            const result: vscode.MessageItem | undefined = await vscode.window.showInformationMessage(
                `Page [${pageItem.pageSnapshot.title}] is currently editing, do you still want to clone the before save version?`,
                {
                    modal: true,
                },
                {
                    title: "Clone",
                },
            );

            if (!result) {
                return;
            }

            if (result.title !== "Clone") {
                return;
            }
        }

        const page: IImbricatePage | null =
            await pageItem.collection.getPage(pageItem.pageSnapshot.identifier);

        if (!page) {
            showErrorMessage("Cannot find page");
            return;
        }

        const initialValue: string = `${page.title} - Copy`;

        const newPageTitle: string | undefined = await vscode.window.showInputBox({
            prompt: "New Page Title",
            placeHolder: "New Page Title",
            value: initialValue,
            valueSelection: [
                page.title.length + 3,
                initialValue.length,
            ],
            validateInput: (value: string) => {

                if (value.trim().length <= 0) {
                    return "Title should not be empty";
                }

                return undefined;
            },
        });

        if (!newPageTitle) {
            return;
        }

        const alreadyExist: boolean = await pageItem.collection.hasPage(
            page.directories,
            newPageTitle,
        );

        if (alreadyExist) {
            showErrorMessage("Page Already Exist");
            return;
        }

        const currentDate: Date = new Date();

        const pageIdentifier: string = UUIDVersion1.generateString();

        const attributes: ImbricatePageAttributes = await page.readAttributes();
        const metadata: ImbricatePageMetadata = {
            title: newPageTitle,
            directories: page.directories,
            identifier: pageIdentifier,
            createdAt: currentDate,
            updatedAt: currentDate,
            digest: page.digest,
            attributes,
            historyRecords: [],
            description: page.description,
        };
        const content: string = await page.readContent();

        await pageItem.collection.putPage(
            metadata,
            content,
        );

        pagesDataProvider.refresh();
    });

    return disposable;
};
