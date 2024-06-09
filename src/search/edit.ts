/**
 * @author WMXPY
 * @namespace Search
 * @description Edit
 */

import { IImbricateOrigin, IImbricateScript, IMBRICATE_SEARCH_RESULT_TYPE } from "@imbricate/core";
import { ActiveEditing, ImbricateOriginManager, createPageSavingTarget, createScriptSavingTarget, establishImbricateSavingTarget } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { EditingTreeViewDataProvider } from "../editing-tree-view/data-provider";
import { PagesTreeViewDataProvider } from "../pages-tree-view/data-provider";
import { PagePersistanceData } from "../pages-tree-view/page-data";
import { recordRecentPage } from "../util/recent";
import { showErrorMessage } from "../util/show-message";
import { OriginMappedSearchResult, SearchResultItem } from "./definition";

export const searchItemEdit = async (
    item: SearchResultItem,
    pagesDataProvider: PagesTreeViewDataProvider,
    editingsDataProvider: EditingTreeViewDataProvider,
    originManager: ImbricateOriginManager,
    context: vscode.ExtensionContext,
): Promise<void> => {

    const result: OriginMappedSearchResult<IMBRICATE_SEARCH_RESULT_TYPE> = item.result;

    const origin: IImbricateOrigin | null = originManager.getOrigin(result.originName);

    if (!origin) {
        showErrorMessage(`Cannot find origin: ${result.originName}`);
        return;
    }

    switch (result.type) {

        case IMBRICATE_SEARCH_RESULT_TYPE.PAGE: {

            const fixedResult: OriginMappedSearchResult<IMBRICATE_SEARCH_RESULT_TYPE.PAGE> =
                result as OriginMappedSearchResult<IMBRICATE_SEARCH_RESULT_TYPE.PAGE>;

            const savingTarget = createPageSavingTarget(
                fixedResult.originName,
                fixedResult.scope,
                fixedResult.identifier,
            );

            const collection = await origin
                .getCollectionManager()
                .getCollection(fixedResult.scope);

            if (!collection) {
                showErrorMessage(`Cannot find collection: ${fixedResult.scope}`);
                return;
            }

            const page = await collection.getPage(fixedResult.identifier);

            if (!page) {
                showErrorMessage(`Cannot find page: ${fixedResult.headline}`);
                return;
            }

            const content: string = await page.readContent();

            const activeEditing: ActiveEditing = await establishImbricateSavingTarget(
                savingTarget,
                `${page.title}.md`,
                content,
            );

            const persistanceData: PagePersistanceData = {
                originName: fixedResult.originName,
                collectionUniqueIdentifier: fixedResult.scope,
                pageSnapshot: {
                    directories: page.directories,
                    title: page.title,
                    identifier: page.identifier,
                },
            };

            await recordRecentPage(
                persistanceData,
                pagesDataProvider,
                context,
            );

            const textDocument: vscode.TextDocument =
                await vscode.workspace.openTextDocument(activeEditing.path);

            await vscode.window.showTextDocument(textDocument);

            editingsDataProvider.refresh();
            return;
        }
        case IMBRICATE_SEARCH_RESULT_TYPE.SCRIPT: {

            const fixedResult: OriginMappedSearchResult<IMBRICATE_SEARCH_RESULT_TYPE.SCRIPT> =
                result as OriginMappedSearchResult<IMBRICATE_SEARCH_RESULT_TYPE.SCRIPT>;

            const savingTarget = createScriptSavingTarget(
                fixedResult.originName,
                fixedResult.identifier,
            );

            const script: IImbricateScript | null =
                await origin
                    .getScriptManager()
                    .getScript(fixedResult.identifier);

            if (!script) {
                showErrorMessage(`Cannot find script: ${fixedResult.headline}`);
                return;
            }

            const content: string = await script.readScript();

            const activeEditing: ActiveEditing = await establishImbricateSavingTarget(
                savingTarget,
                `${script.scriptName}.js`,
                content,
            );

            const textDocument: vscode.TextDocument =
                await vscode.workspace.openTextDocument(activeEditing.path);

            await vscode.window.showTextDocument(textDocument);

            editingsDataProvider.refresh();
            return;
        }
    }
};
