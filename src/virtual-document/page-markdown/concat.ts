/**
 * @author WMXPY
 * @namespace VirtualDocument_PageMarkdown
 * @description Concat
 */

import * as vscode from "vscode";
import { showErrorMessage } from "../../util/show-message";

export const concatPageMarkdownUrl = (
    originName: string,
    collectionUniqueIdentifier: string,
    identifier: string,
    lineNumber?: number,
): vscode.Uri => {

    let uriString: string = `imbricate-page-markdown:${originName}/${collectionUniqueIdentifier}/${identifier}/preview.md`;

    if (typeof lineNumber === "number") {
        uriString += `:${lineNumber}`;
    }

    const uri = vscode.Uri.parse(uriString, true);

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
