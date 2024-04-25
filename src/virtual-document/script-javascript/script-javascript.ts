/**
 * @author WMXPY
 * @namespace VirtualDocument_ScriptJavascript
 * @description Register
 */

import { ImbricateOriginManager } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { ScriptJavascriptContentProvider } from "./provider";

export const registerScriptJavascriptContentProvider = (
    originManager: ImbricateOriginManager,
    context: vscode.ExtensionContext,
) => {

    const scheme = "imbricate-script-javascript";
    const provider = ScriptJavascriptContentProvider.create(originManager);

    const contextProvide = vscode.workspace.registerTextDocumentContentProvider(
        scheme,
        provider,
    )

    context.subscriptions.push(contextProvide);
};
