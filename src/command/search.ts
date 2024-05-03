/**
 * @author WMXPY
 * @namespace Command
 * @description Search
 */

import { IImbricateOriginCollection, IMBRICATE_SEARCH_RESULT_TYPE, ImbricatePageSearchResult, ImbricateScriptSearchResult } from "@imbricate/core";
import { ImbricateOriginManager, ImbricateOriginManagerOriginResponse } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { EditingTreeViewDataProvider } from "../editing-tree-view/data-provider";
import { OriginMappedSearchResult, SearchResultItem } from "../search/definition";
import { searchItemEdit } from "../search/edit";
import { createSearchQuickViewItem } from "../search/item";
import { searchItemPreview } from "../search/preview";

export const registerSearchCommand = (
    originManager: ImbricateOriginManager,
    editingsDataProvider: EditingTreeViewDataProvider,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand("imbricate.search", async () => {

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

        for (const origin of origins) {

            const collections: IImbricateOriginCollection[] = await origin.origin.listCollections();

            collections: for (const collection of collections) {

                if (!collection.includeInSearch) {
                    continue collections;
                }

                const pageResults: ImbricatePageSearchResult[] =
                    await collection.searchPages(prompt, {
                        exact: false,
                        limit: 1,
                    });

                originMappedResults.push(...pageResults.map(
                    (result: ImbricatePageSearchResult) => {
                        return {
                            ...result,
                            originName: origin.originName,
                        };
                    },
                ));
            }

            const scriptResults: ImbricateScriptSearchResult[] =
                await origin.origin.searchScripts(prompt, {
                    exact: false,
                    limit: 1,
                });

            originMappedResults.push(...scriptResults.map(
                (result: ImbricateScriptSearchResult) => {
                    return {
                        ...result,
                        originName: origin.originName,
                    };
                },
            ));
        }

        const quickPickItems: SearchResultItem[] = originMappedResults.map((result: OriginMappedSearchResult<IMBRICATE_SEARCH_RESULT_TYPE>) => {

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
                    quickPick.onDidTriggerItemButton((item) => {
                        if (item.button.tooltip === "Edit") {

                            searchItemEdit(
                                item.item as SearchResultItem,
                                originManager,
                                editingsDataProvider,
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

                        searchItemPreview(current);
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
