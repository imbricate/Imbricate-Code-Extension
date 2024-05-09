/**
 * @author WMXPY
 * @namespace Command
 * @description Register
 */

import { IImbricateConfiguration, ImbricateOriginManager } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { registerCollectionCreateCommand } from "./command/collection-create";
import { registerCollectionRenameCommand } from "./command/collection-rename";
import { registerCollectionSearchExcludeCommand } from "./command/collection-search-exclude";
import { registerCollectionSearchIncludeCommand } from "./command/collection-search-include";
import { registerEditingPerformCommand } from "./command/editing-perform";
import { registerEditingPerformAllCommand } from "./command/editing-perform-all";
import { registerEditingPerformEditorCommand } from "./command/editing-perform-editor";
import { registerEditingsRefreshCommand } from "./command/editing-refresh";
import { registerEditingResumeCommand } from "./command/editing-resume";
import { registerEditingSaveEditorCommand } from "./command/editing-save-editor";
import { registerPageFavoriteClearCommand } from "./command/favorite-clear";
import { registerOriginCreateCommand } from "./command/origin-create";
import { registerPageCreateCommand } from "./command/page-create";
import { registerPageCreateDirectoryCommand } from "./command/page-create-directory";
import { registerPageDeleteCommand } from "./command/page-delete";
import { registerPageEditCommand } from "./command/page-edit";
import { registerPageEditEditorCommand } from "./command/page-edit-editor";
import { registerPageFavoriteCommand } from "./command/page-favorite";
import { registerPagePreviewCommand } from "./command/page-preview";
import { registerPagesRefreshCommand } from "./command/page-refresh";
import { registerPageRetitleCommand } from "./command/page-retitle";
import { registerPageUnfavoriteCommand } from "./command/page-unfavorite";
import { registerPageRecentClearCommand } from "./command/recent-clear";
import { registerPageRecentRemoveCommand } from "./command/recent-remove";
import { registerScriptCreateCommand } from "./command/script-create";
import { registerScriptDeleteCommand } from "./command/script-delete";
import { registerScriptEditCommand } from "./command/script-edit";
import { registerScriptPreviewCommand } from "./command/script-preview";
import { registerScriptsRefreshCommand } from "./command/script-refresh";
import { registerSearchCommand } from "./command/search";
import { EditingTreeViewDataProvider } from "./editing-tree-view/data-provider";
import { registerEditingTreeView } from "./editing-tree-view/register";
import { PagesTreeViewDataProvider } from "./pages-tree-view/data-provider";
import { registerPagesTreeView } from "./pages-tree-view/register";
import { ScriptsTreeViewDataProvider } from "./scripts-tree-view/data-provider";
import { registerScriptsTreeView } from "./scripts-tree-view/register";
import { registerSourceControl } from "./source-control/register";
import { registerEditingOriginalProvider } from "./virtual-document/editing-original/editing-original";
import { registerPageMarkdownContentProvider } from "./virtual-document/page-markdown/page-markdown";
import { registerScriptJavascriptContentProvider } from "./virtual-document/script-javascript/script-javascript";

export const registerOperations = async (
    configuration: IImbricateConfiguration,
    originManager: ImbricateOriginManager,
    context: vscode.ExtensionContext,
): Promise<void> => {

    const editingsDataProvider: EditingTreeViewDataProvider = await registerEditingTreeView(
        configuration,
        context,
    );

    const pagesDataProvider: PagesTreeViewDataProvider = await registerPagesTreeView(
        originManager,
        context,
    );

    const scriptsDataProvider: ScriptsTreeViewDataProvider = await registerScriptsTreeView(
        originManager,
        context,
    );

    registerEditingOriginalProvider(originManager, context);
    registerPageMarkdownContentProvider(originManager, context);
    registerScriptJavascriptContentProvider(originManager, context);

    registerSourceControl(context);

    const collectionCreateCommand = registerCollectionCreateCommand(
        pagesDataProvider,
    );
    context.subscriptions.push(collectionCreateCommand);

    const collectionRenameCommand = registerCollectionRenameCommand(
        pagesDataProvider,
        originManager,
    );
    context.subscriptions.push(collectionRenameCommand);

    const collectionSearchIncludeCommand = registerCollectionSearchIncludeCommand(
        pagesDataProvider,
        originManager,
    );
    context.subscriptions.push(collectionSearchIncludeCommand);

    const collectionSearchExcludeCommand = registerCollectionSearchExcludeCommand(
        pagesDataProvider,
        originManager,
    );
    context.subscriptions.push(collectionSearchExcludeCommand);

    const editingPerformAllCommand = registerEditingPerformAllCommand(
        originManager,
        editingsDataProvider,
    );
    context.subscriptions.push(editingPerformAllCommand);

    const editingPerformEditorCommand = registerEditingPerformEditorCommand(
        originManager,
        editingsDataProvider,
    );
    context.subscriptions.push(editingPerformEditorCommand);

    const editingPerformCommand = registerEditingPerformCommand(
        originManager,
        editingsDataProvider,
    );
    context.subscriptions.push(editingPerformCommand);

    const editingsRefreshCommand = registerEditingsRefreshCommand(
        editingsDataProvider,
    );
    context.subscriptions.push(editingsRefreshCommand);

    const editingSaveEditorCommand = registerEditingSaveEditorCommand(
        originManager,
        editingsDataProvider,
    );
    context.subscriptions.push(editingSaveEditorCommand);

    const editingResumeDisposable = registerEditingResumeCommand();
    context.subscriptions.push(editingResumeDisposable);

    const favoriteClearDisposable = registerPageFavoriteClearCommand(
        pagesDataProvider,
        context,
    );
    context.subscriptions.push(favoriteClearDisposable);

    const originCreateDisposable = registerOriginCreateCommand(
        pagesDataProvider,
        scriptsDataProvider,
        originManager,
    );
    context.subscriptions.push(originCreateDisposable);

    const pageCreateDisposable = registerPageCreateCommand(
        editingsDataProvider,
        pagesDataProvider,
        context,
    );
    context.subscriptions.push(pageCreateDisposable);

    const pageCreateDirectoryDisposable = registerPageCreateDirectoryCommand(
        editingsDataProvider,
        pagesDataProvider,
    );
    context.subscriptions.push(pageCreateDirectoryDisposable);

    const pageDeleteDisposable = registerPageDeleteCommand(
        pagesDataProvider,
        context,
    );
    context.subscriptions.push(pageDeleteDisposable);

    const pageEditDisposable = registerPageEditCommand(
        editingsDataProvider,
        pagesDataProvider,
        context,
    );
    context.subscriptions.push(pageEditDisposable);

    const pageEditEditorDisposable = registerPageEditEditorCommand(
        editingsDataProvider,
        originManager,
    );
    context.subscriptions.push(pageEditEditorDisposable);

    const pageFavoriteDisposable = registerPageFavoriteCommand(
        pagesDataProvider,
        context,
    );
    context.subscriptions.push(pageFavoriteDisposable);

    const pagePreviewDisposable = registerPagePreviewCommand(
        pagesDataProvider,
        context,
    );
    context.subscriptions.push(pagePreviewDisposable);

    const pagesRefreshDisposable = registerPagesRefreshCommand(
        pagesDataProvider,
    );
    context.subscriptions.push(pagesRefreshDisposable);

    const pageRetitleDisposable = registerPageRetitleCommand(
        pagesDataProvider,
        context,
    );
    context.subscriptions.push(pageRetitleDisposable);

    const pageUnfavoriteDisposable = registerPageUnfavoriteCommand(
        pagesDataProvider,
        context,
    );
    context.subscriptions.push(pageUnfavoriteDisposable);

    const recentClearDisposable = registerPageRecentClearCommand(
        pagesDataProvider,
        context,
    );
    context.subscriptions.push(recentClearDisposable);

    const recentRemoveDisposable = registerPageRecentRemoveCommand(
        pagesDataProvider,
        context,
    );
    context.subscriptions.push(recentRemoveDisposable);

    const scriptCreateDisposable = registerScriptCreateCommand(
        editingsDataProvider,
        scriptsDataProvider,
        originManager,
    );
    context.subscriptions.push(scriptCreateDisposable);

    const scriptDeleteDisposable = registerScriptDeleteCommand(
        scriptsDataProvider,
    );
    context.subscriptions.push(scriptDeleteDisposable);

    const scriptEditDisposable = registerScriptEditCommand(
        editingsDataProvider,
    );
    context.subscriptions.push(scriptEditDisposable);

    const scriptPreviewDisposable = registerScriptPreviewCommand();
    context.subscriptions.push(scriptPreviewDisposable);

    const scriptsRefreshDisposable = registerScriptsRefreshCommand(
        scriptsDataProvider,
    );
    context.subscriptions.push(scriptsRefreshDisposable);

    const searchDisposable = registerSearchCommand(
        originManager,
        editingsDataProvider,
    );
    context.subscriptions.push(searchDisposable);
};
