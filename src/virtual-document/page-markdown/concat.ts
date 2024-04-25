/**
 * @author WMXPY
 * @namespace VirtualDocument_PageMarkdown
 * @description Concat
 */

import * as vscode from "vscode";

export const concatPageMarkdownUrl = (
    originName: string,
    collectionName: string,
    identifier: string,
): vscode.Uri => {

    const uri = vscode.Uri.parse(`imbricate-page-markdown:${originName}/${collectionName}/${identifier}/preview.md`);

    return uri;
};
