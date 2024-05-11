/**
 * @author WMXPY
 * @namespace Command
 * @description Markdown Paste
 */

import { resolveImbricateTempDirectory } from "@imbricate/local-fundamental";
import * as vscode from "vscode";

export const registerMarkdownPasteCommand = (
    _context: vscode.ExtensionContext,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand("imbricate.markdown.paste", async () => {

        const proceedRegularPaste = (): void => {
            vscode.commands.executeCommand("editor.action.clipboardPasteAction");
        };

        const currentEditor: vscode.TextEditor | undefined =
            vscode.window.activeTextEditor;
        if (!currentEditor) {
            return proceedRegularPaste();
        }

        const documentUri: vscode.Uri = currentEditor.document.uri;
        if (!documentUri) {
            return proceedRegularPaste();
        }

        const tempPath: string = resolveImbricateTempDirectory();
        if (!documentUri.fsPath.startsWith(tempPath)) {
            return proceedRegularPaste();
        }

        const clipBoardValue: string | undefined =
            await vscode.env.clipboard.readText();

        if (typeof clipBoardValue === "undefined") {
            return;
        }

        if (typeof clipBoardValue === "string" && clipBoardValue.length > 0) {
            return proceedRegularPaste();
        }

        return proceedRegularPaste();
    });

    return disposable;
};
