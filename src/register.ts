/**
 * @author WMXPY
 * @namespace Command
 * @description Register
 */

import { IImbricateConfiguration, ImbricateOriginManager } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { registerEditingPerformCommand } from "./command/editing-perform";
import { registerEditingsRefreshCommand } from "./command/editing-refresh";
import { registerEditingResumeCommand } from "./command/editing-resume";
import { registerPageEditCommand } from "./command/page-edit";
import { registerPagePreviewCommand } from "./command/page-preview";
import { registerPagesRefreshCommand } from "./command/page-refresh";
import { registerScriptEditCommand } from "./command/script-edit";
import { registerScriptPreviewCommand } from "./command/script-preview";
import { registerScriptsRefreshCommand } from "./command/script-refresh";
import { EditingTreeViewDataProvider } from "./editing-tree-view/data-provider";
import { registerEditingTreeView } from "./editing-tree-view/register";
import { PagesTreeViewDataProvider } from "./pages-tree-view/data-provider";
import { registerPagesTreeView } from "./pages-tree-view/register";
import { ScriptsTreeViewDataProvider } from "./scripts-tree-view/data-provider";
import { registerScriptsTreeView } from "./scripts-tree-view/register";
import { registerPageMarkdownContentProvider } from "./virtual-document/page-markdown/page-markdown";
import { registerScriptJavascriptContentProvider } from "./virtual-document/script-javascript/script-javascript";

export const registerOperations = async (
    configuration: IImbricateConfiguration,
    originManager: ImbricateOriginManager,
    context: vscode.ExtensionContext,
): Promise<void> => {

    const editingsDataProvider: EditingTreeViewDataProvider =
        await registerEditingTreeView(configuration);
    const pagesDataProvider: PagesTreeViewDataProvider =
        await registerPagesTreeView(configuration, originManager);
    const scriptsDataProvide: ScriptsTreeViewDataProvider =
        await registerScriptsTreeView(configuration, originManager);

    registerPageMarkdownContentProvider(originManager, context);
    registerScriptJavascriptContentProvider(originManager, context);

    const editingPerformCommand = registerEditingPerformCommand(
        originManager,
        editingsDataProvider,
    );
    context.subscriptions.push(editingPerformCommand);

    const editingsRefreshCommand = registerEditingsRefreshCommand(editingsDataProvider);
    context.subscriptions.push(editingsRefreshCommand);

    const editingResumeDisposable = registerEditingResumeCommand();
    context.subscriptions.push(editingResumeDisposable);

    const pageEditDisposable = registerPageEditCommand(
        editingsDataProvider,
    );
    context.subscriptions.push(pageEditDisposable);

    const pagePreviewDisposable = registerPagePreviewCommand();
    context.subscriptions.push(pagePreviewDisposable);

    const pagesRefreshDisposable = registerPagesRefreshCommand(pagesDataProvider);
    context.subscriptions.push(pagesRefreshDisposable);

    const scriptEditDisposable = registerScriptEditCommand(
        editingsDataProvider,
    );
    context.subscriptions.push(scriptEditDisposable);

    const scriptPreviewDisposable = registerScriptPreviewCommand();
    context.subscriptions.push(scriptPreviewDisposable);

    const scriptsRefreshDisposable = registerScriptsRefreshCommand(scriptsDataProvide);
    context.subscriptions.push(scriptsRefreshDisposable);
};
