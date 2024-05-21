/**
 * @author WMXPY
 * @namespace VirtualDocument_ScriptJavascript
 * @description Concat
 */

import * as vscode from "vscode";
import { showErrorMessage } from "../../util/show-message";

export const concatScriptJavascriptUrl = (
    originName: string,
    identifier: string,
): vscode.Uri => {

    const uri = vscode.Uri.parse(`imbricate-script-javascript:${originName}/${identifier}/preview.js`);

    return uri;
};

export const divideScriptMarkdownUrl = (uri: vscode.Uri): [string, string] => {

    const path: string = uri.path;
    const parts: string[] = path.split("/");

    if (parts.length !== 4) {

        showErrorMessage(`Invalid URI, unable to divide: ${uri.path}`);
        return ["", ""];
    }

    return [parts[0], parts[2]];
};
