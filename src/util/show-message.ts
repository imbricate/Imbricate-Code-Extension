/**
 * @author WMXPY
 * @namespace Util
 * @description Show Message
 */

import * as vscode from "vscode";

export const showErrorMessage = (message: string): void => {

    vscode.window.showErrorMessage(message);
};