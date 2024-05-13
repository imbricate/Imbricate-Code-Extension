/**
 * @author WMXPY
 * @namespace SourceControl
 * @description Register
 */

import { resolveImbricateTempDirectory } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { buildFileUri } from "../util/path";
import { ImbricateQuickDiffProvider } from "./quick-diff-provider";

export const registerSourceControl = (
    context: vscode.ExtensionContext,
): void => {

    const rootFolder = resolveImbricateTempDirectory();
    const rootUri = buildFileUri(rootFolder);

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
