/**
 * @author WMXPY
 * @namespace VirtualDocument_PageMarkdown
 * @description Concat
 */

import * as vscode from "vscode";
import { showErrorMessage } from "../../util/show-message";

export const concatPageMarkdownUrl = (
    originName: string,
    collectionName: string,
    collectionUniqueIdentifier: string,
    identifier: string,
): vscode.Uri => {

    const uri = vscode.Uri.parse(`imbricate-page-markdown:${originName}/${collectionUniqueIdentifier}/${identifier}/preview.md`);

    return uri;
};

export const dividePageMarkdownUrl = (uri: vscode.Uri): [string, string, string] => {

    const path: string = uri.path;
    const parts: string[] = path.split("/");

    if (parts.length !== 4) {

        showErrorMessage(`Invalid URI, unable to divide: ${uri.path}`);
        return ["", "", ""];
    }

    return [parts[0], parts[1], parts[2]];
};
