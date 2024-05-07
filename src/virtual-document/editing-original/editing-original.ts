/**
 * @author WMXPY
 * @namespace VirtualDocument_EditingOriginal
 * @description Register
 */

import { ImbricateOriginManager } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { IMBRICATE_EDITING_ORIGINAL_SCHEME } from "./concat";
import { EditingOriginalProvider } from "./provider";

export const registerEditingOriginalProvider = (
    originManager: ImbricateOriginManager,
    context: vscode.ExtensionContext,
) => {

    const scheme = IMBRICATE_EDITING_ORIGINAL_SCHEME;
    const provider = EditingOriginalProvider.create(
        originManager,
    );

    const contextProvide = vscode.workspace.registerTextDocumentContentProvider(
        scheme,
        provider,
    );

    context.subscriptions.push(contextProvide);
};
