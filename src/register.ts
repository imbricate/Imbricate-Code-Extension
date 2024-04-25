/**
 * @author WMXPY
 * @namespace Command
 * @description Register
 */

import { IImbricateConfiguration, ImbricateOriginManager } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { registerEditingRefreshCommand } from "./command/editing-refresh";
import { registerEditingResumeCommand } from "./command/editing-resume";
import { registerPageEditCommand } from "./command/page-edit";
import { registerPagePreviewCommand } from "./command/page-preview";
import { registerRefreshCommand } from "./command/refresh";
import { registerScriptEditCommand } from "./command/script-edit";
import { EditingTreeViewDataProvider } from "./editing-tree-view/data-provider";
import { registerEditingTreeView } from "./editing-tree-view/register";
import { PagesTreeViewDataProvider } from "./pages-tree-view/data-provider";
import { registerPagesTreeView } from "./pages-tree-view/register";
import { ScriptsTreeViewDataProvider } from "./scripts-tree-view/data-provider";
import { registerScriptsTreeView } from "./scripts-tree-view/register";
import { registerPageMarkdownContentProvider } from "./virtual-document/page-markdown/page-markdown";

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

    const editingRefreshCommand = registerEditingRefreshCommand(editingsDataProvider);
    context.subscriptions.push(editingRefreshCommand);

    const editingResumeDisposable = registerEditingResumeCommand();
    context.subscriptions.push(editingResumeDisposable);

    const pageEditDisposable = registerPageEditCommand();
    context.subscriptions.push(pageEditDisposable);

    const pagePreviewDisposable = registerPagePreviewCommand();
    context.subscriptions.push(pagePreviewDisposable);

    const refreshDisposable = registerRefreshCommand();
    context.subscriptions.push(refreshDisposable);

    const scriptEditDisposable = registerScriptEditCommand();
    context.subscriptions.push(scriptEditDisposable);
};
