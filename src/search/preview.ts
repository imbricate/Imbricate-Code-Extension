/**
 * @author WMXPY
 * @namespace Search
 * @description Preview
 */

import { IMBRICATE_SEARCH_RESULT_TYPE } from "@imbricate/core";
import * as vscode from "vscode";
import { concatPageMarkdownUrl } from "../virtual-document/page-markdown/concat";
import { concatScriptJavascriptUrl } from "../virtual-document/script-javascript/concat";
import { OriginMappedSearchResult, SearchResultItem } from "./definition";

export const searchItemPreview = async (
    item: SearchResultItem,
): Promise<void> => {

    const result: OriginMappedSearchResult<IMBRICATE_SEARCH_RESULT_TYPE> = item.result;

    switch (result.type) {

        case IMBRICATE_SEARCH_RESULT_TYPE.PAGE: {

            const fixedResult: OriginMappedSearchResult<IMBRICATE_SEARCH_RESULT_TYPE.PAGE> =
                result as OriginMappedSearchResult<IMBRICATE_SEARCH_RESULT_TYPE.PAGE>;

            const uri = concatPageMarkdownUrl(
                fixedResult.originName,
                fixedResult.scope,
                fixedResult.identifier,
            );

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
