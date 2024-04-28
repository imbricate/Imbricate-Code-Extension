/**
 * @author WMXPY
 * @namespace Search
 * @description Definition
 */

import { IMBRICATE_SEARCH_RESULT_TYPE, ImbricateSearchResult } from "@imbricate/core";
import * as vscode from "vscode";

export type OriginMappedSearchResult<T extends IMBRICATE_SEARCH_RESULT_TYPE> = ImbricateSearchResult<T> & {
    readonly originName: string;
};

export type SearchResultItem = {
    readonly result: OriginMappedSearchResult<IMBRICATE_SEARCH_RESULT_TYPE>;
} & vscode.QuickPickItem;
