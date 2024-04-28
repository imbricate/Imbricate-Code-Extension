/**
 * @author WMXPY
 * @namespace VirtualDocument_PageMarkdown
 * @description Register
 */

import { ImbricateOriginManager } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { PageMarkdownContentProvider } from "./provider";

export const registerPageMarkdownContentProvider = (
    originManager: ImbricateOriginManager,
    context: vscode.ExtensionContext,
) => {

    const scheme = "imbricate-page-markdown";
    const provider = PageMarkdownContentProvider.create(originManager);

    const contextProvide = vscode.workspace.registerTextDocumentContentProvider(
        scheme,
        provider,
    );

    context.subscriptions.push(contextProvide);
};
