/**
 * @author WMXPY
 * @namespace Command
 * @description Register
 */

import { IImbricateConfiguration, ImbricateOriginManager } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { registerCollectionCopyIdentifierCommand } from "./command/collection-copy-identifier";
import { registerCollectionCreateCommand } from "./command/collection-create";
import { registerCollectionDeleteCommand } from "./command/collection-delete";
import { registerCollectionRenameCommand } from "./command/collection-rename";
import { registerCollectionSearchExcludeCommand } from "./command/collection-search-exclude";
import { registerCollectionSearchIncludeCommand } from "./command/collection-search-include";
import { registerDocumentCopyCodeBlockCommand } from "./command/document-copy-code-block";
import { registerEditingDiscardCommand } from "./command/editing-discard";
import { registerEditingPerformCommand } from "./command/editing-perform";
import { registerEditingPerformAllCommand } from "./command/editing-perform-all";
import { registerEditingPerformEditorCommand } from "./command/editing-perform-editor";
import { registerEditingsRefreshCommand } from "./command/editing-refresh";
import { registerEditingResumeCommand } from "./command/editing-resume";
import { registerEditingSaveEditorCommand } from "./command/editing-save-editor";
import { registerPageFavoriteClearCommand } from "./command/favorite-clear";
import { registerHistoryResetCommand } from "./command/history-reset";
import { registerOriginBinaryUploadCommand } from "./command/origin-binary-upload";
import { registerOriginCreateCommand } from "./command/origin-create";
import { registerPageCopyIdentifierCommand } from "./command/page-copy-identifier";
import { registerPageCopyTraceCommand } from "./command/page-copy-trace";
import { registerPageCreateCommand } from "./command/page-create";
import { registerPageCreateDirectoryCommand } from "./command/page-create-directory";
import { registerPageDeleteCommand } from "./command/page-delete";
import { registerPageEditCommand } from "./command/page-edit";
import { registerPageEditEditorCommand } from "./command/page-edit-editor";
import { registerPageFavoriteCommand } from "./command/page-favorite";
import { registerPageMoveCollectionCommand } from "./command/page-move-collection";
import { registerPageMoveDirectoryCommand } from "./command/page-move-directory";
import { registerPagePreviewCommand } from "./command/page-preview";
import { registerPagesRefreshCommand } from "./command/page-refresh";
import { registerPageRetitleCommand } from "./command/page-retitle";
import { registerPageShowHistoryCommand } from "./command/page-show-history";
import { registerPageUnfavoriteCommand } from "./command/page-unfavorite";
import { registerPageRecentClearCommand } from "./command/recent-clear";
import { registerPageRecentRemoveCommand } from "./command/recent-remove";
import { registerScriptCreateCommand } from "./command/script-create";
import { registerScriptDeleteCommand } from "./command/script-delete";
import { registerScriptEditCommand } from "./command/script-edit";
import { registerScriptEditEditorCommand } from "./command/script-edit-editor";
import { registerScriptExecuteCommand } from "./command/script-execute";
import { registerScriptExecuteEditorCommand } from "./command/script-execute-editor";
import { registerScriptExecuteSaveEditorCommand } from "./command/script-execute-save-editor";
import { registerScriptPreviewCommand } from "./command/script-preview";
import { registerScriptsRefreshCommand } from "./command/script-refresh";
import { registerScriptRenameCommand } from "./command/script-rename";
import { registerScriptShowHistoryCommand } from "./command/script-show-history";
import { registerSearchCommand } from "./command/search";
import { registerTogglePageTreeViewModeCommand } from "./command/toggle-page-tree-view-mode";
import { registerPageDocumentLinkProvider } from "./document-link/page/register";
import { EditingTreeViewDataProvider } from "./editing-tree-view/data-provider";
import { registerEditingTreeView } from "./editing-tree-view/register";
import { HistoryTreeViewDataProvider } from "./history-tree-view/data-provider";
import { registerHistoryTreeView } from "./history-tree-view/register";
import { registerCodeLensProvider } from "./lens/copy-code/register";
import { registerPreCodeLensProvider } from "./lens/copy-pre-code/register";
import { OriginsTreeViewDataProvider } from "./origins-tree-view/data-provider";
import { registerOriginsTreeView } from "./origins-tree-view/register";
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

    const historiesDataProvider: HistoryTreeViewDataProvider = await registerHistoryTreeView(
        configuration,
        context,
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const originsDataProvider: OriginsTreeViewDataProvider = await registerOriginsTreeView(
        originManager,
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

    registerPageDocumentLinkProvider(context);

    registerCodeLensProvider(context);
    registerPreCodeLensProvider(context);

    const collectionCopyIdentifierCommand = registerCollectionCopyIdentifierCommand();
    context.subscriptions.push(collectionCopyIdentifierCommand);

    const collectionCreateCommand = registerCollectionCreateCommand(
        pagesDataProvider,
    );
    context.subscriptions.push(collectionCreateCommand);

    const collectionDeleteCommand = registerCollectionDeleteCommand(
        pagesDataProvider,
        originManager,
    );
    context.subscriptions.push(collectionDeleteCommand);

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

    const documentCopyCodeBlockCommand = registerDocumentCopyCodeBlockCommand();
    context.subscriptions.push(documentCopyCodeBlockCommand);

    const editingDiscardCommand = registerEditingDiscardCommand(
        editingsDataProvider,
    );
    context.subscriptions.push(editingDiscardCommand);

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
    );
    context.subscriptions.push(editingSaveEditorCommand);

    const editingResumeDisposable = registerEditingResumeCommand();
    context.subscriptions.push(editingResumeDisposable);

    const favoriteClearDisposable = registerPageFavoriteClearCommand(
        pagesDataProvider,
        context,
    );
    context.subscriptions.push(favoriteClearDisposable);

    const historyResetDisposable = registerHistoryResetCommand(
        historiesDataProvider,
    );
    context.subscriptions.push(historyResetDisposable);

    const originBinaryUploadDisposable = registerOriginBinaryUploadCommand(
        originManager,
        context,
    );
    context.subscriptions.push(originBinaryUploadDisposable);

    const originCreateDisposable = registerOriginCreateCommand(
        pagesDataProvider,
        scriptsDataProvider,
        originManager,
    );
    context.subscriptions.push(originCreateDisposable);

    const pageCopyIdentifierDisposable = registerPageCopyIdentifierCommand();
    context.subscriptions.push(pageCopyIdentifierDisposable);

    const pageCopyTraceDisposable = registerPageCopyTraceCommand();
    context.subscriptions.push(pageCopyTraceDisposable);

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
        pagesDataProvider,
        originManager,
        context,
    );
    context.subscriptions.push(pageEditEditorDisposable);

    const pageFavoriteDisposable = registerPageFavoriteCommand(
        pagesDataProvider,
        context,
    );
    context.subscriptions.push(pageFavoriteDisposable);

    const pageMoveCollectionDisposable = registerPageMoveCollectionCommand(
        originManager,
        pagesDataProvider,
        context,
    );
    context.subscriptions.push(pageMoveCollectionDisposable);

    const pageMoveDirectoryDisposable = registerPageMoveDirectoryCommand(
        pagesDataProvider,
        context,
    );
    context.subscriptions.push(pageMoveDirectoryDisposable);

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

    const pageShowHistoryDisposable = registerPageShowHistoryCommand(
        historiesDataProvider,
    );
    context.subscriptions.push(pageShowHistoryDisposable);

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

    const scriptEditEditorDisposable = registerScriptEditEditorCommand(
        editingsDataProvider,
        scriptsDataProvider,
        originManager,
        context,
    );
    context.subscriptions.push(scriptEditEditorDisposable);

    const scriptExecuteDisposable = registerScriptExecuteCommand();
    context.subscriptions.push(scriptExecuteDisposable);

    const scriptExecuteEditorDisposable = registerScriptExecuteEditorCommand(
        originManager,
    );
    context.subscriptions.push(scriptExecuteEditorDisposable);

    const scriptExecuteSaveEditorDisposable = registerScriptExecuteSaveEditorCommand(
        originManager,
    );
    context.subscriptions.push(scriptExecuteSaveEditorDisposable);

    const scriptPreviewDisposable = registerScriptPreviewCommand();
    context.subscriptions.push(scriptPreviewDisposable);

    const scriptsRefreshDisposable = registerScriptsRefreshCommand(
        scriptsDataProvider,
    );
    context.subscriptions.push(scriptsRefreshDisposable);

    const scriptRenameDisposable = registerScriptRenameCommand(
        scriptsDataProvider,
    );
    context.subscriptions.push(scriptRenameDisposable);

    const scriptShowHistoryDisposable = registerScriptShowHistoryCommand(
        historiesDataProvider,
    );
    context.subscriptions.push(scriptShowHistoryDisposable);

    const searchDisposable = registerSearchCommand(
        pagesDataProvider,
        editingsDataProvider,
        originManager,
        context,
    );
    context.subscriptions.push(searchDisposable);

    const togglePageTreeViewModeDisposable = registerTogglePageTreeViewModeCommand(
        pagesDataProvider,
        context,
    );
    context.subscriptions.push(togglePageTreeViewModeDisposable);
};
