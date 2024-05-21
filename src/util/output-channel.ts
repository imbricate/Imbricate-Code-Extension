/**
 * @author WMXPY
 * @namespace Util
 * @description Output Channel
 */

import * as vscode from "vscode";

const imbricateChannel = vscode.window.createOutputChannel("Imbricate");
const scriptChannel = vscode.window.createOutputChannel("Imbricate Script");
const verboseChannel = vscode.window.createOutputChannel("Imbricate Verbose");

export const logInfo = (message: string): void => {

    console.log(`[Info] ${message}`);
    imbricateChannel.appendLine(`[Info] ${message}`);
};

export const logError = (message: string): void => {

    console.log(`[Error] ${message}`);
    imbricateChannel.appendLine(`[Error] ${message}`);
};

export const logScript = (message: string): void => {

    console.log(`[Script] ${message}`);
    scriptChannel.appendLine(message);
};

export const logVerbose = (message: string): void => {

    console.log(`[Verbose] ${message}`);
    verboseChannel.appendLine(message);
};

