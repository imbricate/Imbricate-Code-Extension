/**
 * @author WMXPY
 * @namespace Search
 * @description Preview
 */

import { IImbricateOrigin, IMBRICATE_SEARCH_RESULT_TYPE } from "@imbricate/core";
import { ImbricateOriginManager } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { PagesTreeViewDataProvider } from "../pages-tree-view/data-provider";
import { PagePersistanceData } from "../pages-tree-view/page-data";
import { recordRecentPage } from "../util/recent";
import { showErrorMessage } from "../util/show-message";
import { concatPageMarkdownUrl } from "../virtual-document/page-markdown/concat";
import { concatScriptJavascriptUrl } from "../virtual-document/script-javascript/concat";
import { OriginMappedSearchResult, SearchResultItem } from "./definition";

export const searchItemPreview = async (
    item: SearchResultItem,
    pagesDataProvider: PagesTreeViewDataProvider,
    originManager: ImbricateOriginManager,
    context: vscode.ExtensionContext,
    line?: number,
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

            const uri = concatPageMarkdownUrl(
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

            if (typeof line === "number") {
                uri.with({ fragment: `L${line}` });
            }

            const textDocument: vscode.TextDocument =
                await vscode.workspace.openTextDocument(uri);

            await vscode.window.showTextDocument(textDocument);
            return;
        }
        case IMBRICATE_SEARCH_RESULT_TYPE.SCRIPT: {

            const fixedResult: OriginMappedSearchResult<IMBRICATE_SEARCH_RESULT_TYPE.SCRIPT> =
                result as OriginMappedSearchResult<IMBRICATE_SEARCH_RESULT_TYPE.SCRIPT>;

            const uri = concatScriptJavascriptUrl(
                fixedResult.originName,
                fixedResult.identifier,
            );

            const textDocument: vscode.TextDocument =
                await vscode.workspace.openTextDocument(uri);

            await vscode.window.showTextDocument(textDocument);
            return;
        }
    }
};
