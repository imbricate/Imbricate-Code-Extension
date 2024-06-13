/**
 * @author WMXPY
 * @namespace Search
 * @description Item
 */

import { IMBRICATE_SEARCH_RESULT_TYPE } from "@imbricate/core";
import * as vscode from "vscode";
import { OriginMappedSearchResult, SearchResultItem } from "./definition";

export const createSearchQuickViewItem = (
    result: OriginMappedSearchResult<IMBRICATE_SEARCH_RESULT_TYPE>,
): SearchResultItem => {

    switch (result.type) {

        case IMBRICATE_SEARCH_RESULT_TYPE.PAGE: {

            const fixedResult: OriginMappedSearchResult<
                IMBRICATE_SEARCH_RESULT_TYPE.PAGE
            > = result as OriginMappedSearchResult<
                IMBRICATE_SEARCH_RESULT_TYPE.PAGE
            >;

            const snippet = fixedResult.snippets[0]!;

            const item: SearchResultItem = {
                label: fixedResult.headline,
                iconPath: new vscode.ThemeIcon("book"),
                description: `${fixedResult.originName} - ${fixedResult.collectionName}`,
                detail: snippet.snippet,
                buttons: [
                    {
                        iconPath: new vscode.ThemeIcon("edit"),
                        tooltip: "Edit",
                    },
                ],
                result: fixedResult,
            };

            return item;
        }
        case IMBRICATE_SEARCH_RESULT_TYPE.SCRIPT: {

            const fixedResult: OriginMappedSearchResult<IMBRICATE_SEARCH_RESULT_TYPE.SCRIPT> =
                result as OriginMappedSearchResult<IMBRICATE_SEARCH_RESULT_TYPE.SCRIPT>;

            const snippet = fixedResult.snippets[0]!;

            const item: SearchResultItem = {
                label: fixedResult.headline,
                iconPath: new vscode.ThemeIcon("code"),
                description: `${fixedResult.originName}`,
                detail: snippet.snippet,
                buttons: [
                    {
                        iconPath: new vscode.ThemeIcon("edit"),
                        tooltip: "Edit",
                    },
                ],
                result: fixedResult,
            };

            return item;
        }
    }
};
