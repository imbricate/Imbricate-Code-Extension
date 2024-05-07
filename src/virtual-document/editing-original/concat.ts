/**
 * @author WMXPY
 * @namespace VirtualDocument_EditingOriginal
 * @description Concat
 */

import * as vscode from "vscode";

export const IMBRICATE_EDITING_ORIGINAL_SCHEME: string = "imbricate-editing-original";

export const concatEditingOriginalUrl = (
    activeEditingIdentifier: string,
): vscode.Uri => {

    const uri = vscode.Uri.parse(`${IMBRICATE_EDITING_ORIGINAL_SCHEME}:${activeEditingIdentifier}/original`);

    return uri;
};

export const divideEditingOriginalUrl = (uri: vscode.Uri): string => {

    const path: string = uri.path;
    const parts: string[] = path.split("/");

    if (parts.length !== 2) {
        throw new Error(`Invalid URI, unable to divide: ${uri.path}`);
    }

    return parts[0];
};
