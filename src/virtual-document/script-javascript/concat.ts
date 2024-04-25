/**
 * @author WMXPY
 * @namespace VirtualDocument_ScriptJavascript
 * @description Concat
 */

import * as vscode from "vscode";

export const concatScriptJavascriptUrl = (
    originName: string,
    identifier: string,
): vscode.Uri => {

    const uri = vscode.Uri.parse(`imbricate-script-javascript:${originName}/${identifier}/preview.js`);

    return uri;
};
