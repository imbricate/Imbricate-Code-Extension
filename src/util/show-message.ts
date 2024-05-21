/**
 * @author WMXPY
 * @namespace Util
 * @description Show Message
 */

import * as vscode from "vscode";
import { logError, logInfo, logScript } from "./output-channel";

export const showErrorMessage = (message: string): void => {

    vscode.window.showErrorMessage(message);
    logError(message);
};

export const showScriptPrintMessage = (message: string): void => {

    const scriptMessage: string = `[Script] ${message}`;
    vscode.window.showInformationMessage(scriptMessage);
    logScript(message);
};

export const showInformationMessage = (message: string): void => {

    vscode.window.showInformationMessage(message);
    logInfo(message);
};
