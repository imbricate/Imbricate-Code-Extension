/**
 * @author WMXPY
 * @namespace SourceControl
 * @description Register
 */

import * as vscode from "vscode";
import { ImbricateQuickDiffProvider } from "./quick-diff-provider";
import { resolveImbricateTempDirectory } from "@imbricate/local-fundamental";

export const registerSourceControl = (
    context: vscode.ExtensionContext,
): void => {

    const rootFolder = resolveImbricateTempDirectory();
    const rootUri = vscode.Uri.parse(rootFolder);

    const sourceControl: vscode.SourceControl =
        vscode.scm.createSourceControl(
            "imbricate",
            "Imbricate",
            rootUri,
        );

    const quickDiffProvider = new ImbricateQuickDiffProvider();
    sourceControl.quickDiffProvider = quickDiffProvider;

    context.subscriptions.push(sourceControl);
};
