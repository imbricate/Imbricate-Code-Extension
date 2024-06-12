/**
 * @author WMXPY
 * @namespace Command
 * @description Search
 */

import { IImbricateCollection, IMBRICATE_SEARCH_RESULT_TYPE, ImbricatePageSearchResult, ImbricateScriptSearchResult } from "@imbricate/core";
import { ImbricateOriginManager, ImbricateOriginManagerOriginResponse, ImbricateSearchPreference, IncludedSearchPreference, readOrCreateSearchPreferenceConfiguration, resolveImbricateHomeDirectory } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { EditingTreeViewDataProvider } from "../editing-tree-view/data-provider";
import { PagesTreeViewDataProvider } from "../pages-tree-view/data-provider";
import { OriginMappedSearchResult, SearchResultItem } from "../search/definition";
import { searchItemEdit } from "../search/edit";
import { createSearchQuickViewItem } from "../search/item";
import { searchItemPreview } from "../search/preview";

export const registerSearchCommand = (
    pagesDataProvider: PagesTreeViewDataProvider,
    editingsDataProvider: EditingTreeViewDataProvider,
    originManager: ImbricateOriginManager,
    context: vscode.ExtensionContext,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand(
        "imbricate.search", async (
    ) => {

        const prompt: string | undefined = await vscode.window.showInputBox({
            title: "Search",
            prompt: "Search for...",
            validateInput: (value: string) => {

                if (value.trim().length === 0) {
                    return "Search value should not be empty";
                }

                return undefined;
            },
        });

        if (!prompt) {
            return;
        }

        const origins: ImbricateOriginManagerOriginResponse[] = originManager.origins;
        const originMappedResults: Array<OriginMappedSearchResult<IMBRICATE_SEARCH_RESULT_TYPE>> = [];

        const configurationPath: string = resolveImbricateHomeDirectory();
        const searchPreference: ImbricateSearchPreference =
            await readOrCreateSearchPreferenceConfiguration(
                configurationPath,
            );

        for (const origin of origins) {

            const collections: IImbricateCollection[] = await origin.origin
                .getCollectionManager()
                .listCollections();

            collections: for (const collection of collections) {

                const includedInSearch = searchPreference.included.some((item: IncludedSearchPreference) => {
                    return item.originName === origin.originName &&
                        item.collectionUniqueIdentifier === collection.uniqueIdentifier;
                });

                if (!includedInSearch) {
                    continue collections;
                }

                const pageResults: ImbricatePageSearchResult[] =
                    await collection.searchPages(prompt, {
                        exact: false,
                        snippetLimit: 1,
                    });

                originMappedResults.push(...pageResults.map(
                    (result: ImbricatePageSearchResult) => {
                        return {
                            ...result,
                            originUniqueIdentifier: origin.origin.uniqueIdentifier,
                            originName: origin.originName,
                        };
                    },
                ));
            }

            const scriptResults: ImbricateScriptSearchResult[] =
                await origin.origin
                    .getScriptManager()
                    .searchScripts(prompt, {
                        exact: false,
                        snippetLimit: 1,
                    });

            originMappedResults.push(...scriptResults.map(
                (result: ImbricateScriptSearchResult) => {
                    return {
                        ...result,
                        originUniqueIdentifier: origin.origin.uniqueIdentifier,
                        originName: origin.originName,
                    };
                },
            ));
        }

        const quickPickItems: SearchResultItem[] = originMappedResults.map((
            result: OriginMappedSearchResult<IMBRICATE_SEARCH_RESULT_TYPE>,
        ) => {

            return createSearchQuickViewItem(result);
        });


        const disposables: vscode.Disposable[] = [];
        try {

            await new Promise<void>((resolve: () => void) => {

                let current: SearchResultItem | null = null;

                const quickPick = vscode.window.createQuickPick();
                quickPick.title = "Search Results";
                quickPick.items = quickPickItems;

                disposables.push(
                    quickPick.onDidChangeSelection((items) => {
                        current = items[0] as SearchResultItem | null;
                    }),
                );
                disposables.push(
                    quickPick.onDidTriggerItemButton(async (item) => {
                        if (item.button.tooltip === "Edit") {

                            const fixedItem: SearchResultItem =
                                item.item as SearchResultItem;

                            searchItemEdit(
                                fixedItem,
                                pagesDataProvider,
                                editingsDataProvider,
                                originManager,
                                context,
                            );
                            quickPick.hide();
                        }
                    }),
                );
                disposables.push(
                    quickPick.onDidHide(() => {
                        quickPick.dispose();
                        resolve();
                    }),
                );
                disposables.push(
                    quickPick.onDidAccept(() => {

                        if (!current) {
                            quickPick.hide();
                            return;
                        }

                        searchItemPreview(
                            current,
                            pagesDataProvider,
                            originManager,
                            context,
                        );
                        quickPick.hide();
                    }),
                );

                quickPick.show();
            });
        } finally {

            disposables.forEach(disposable => disposable.dispose());
        }
    });

    return disposable;
};
