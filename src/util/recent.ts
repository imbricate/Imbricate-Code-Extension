/**
 * @author WMXPY
 * @namespace Util
 * @description Recent
 */

import { ImbricateOriginManager } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { CONFIG_KEY, getConfiguration } from "../configuration/get-config";
import { PagesTreeViewDataProvider } from "../pages-tree-view/data-provider";
import { PAGES_RECENTS_KEY, PagePersistanceData } from "../pages-tree-view/page-data";

export const recordRecentPage = async (
    originManager: ImbricateOriginManager,
    persistanceData: PagePersistanceData,
    pageDataProvider: PagesTreeViewDataProvider,
    context: vscode.ExtensionContext,
    refresh: boolean = true,
): Promise<void> => {

    if (originManager.isDynamicOrigin(persistanceData.originName)) {
        return;
    }

    const currentRecents: PagePersistanceData[] | undefined =
        context.globalState.get(PAGES_RECENTS_KEY);

    if (!currentRecents) {
        await context.globalState.update(PAGES_RECENTS_KEY, [persistanceData]);
        return;
    }

    const maximumRecentPages: number =
        getConfiguration(CONFIG_KEY.PAGE_RECENT_MAXIMUM);

    const filteredItems: PagePersistanceData[] = currentRecents.filter((current: PagePersistanceData) => {
        return current.originName !== persistanceData.originName
            || current.collectionUniqueIdentifier !== persistanceData.collectionUniqueIdentifier
            || current.pageSnapshot.identifier !== persistanceData.pageSnapshot.identifier;
    });

    if (filteredItems.length < maximumRecentPages) {

        await context.globalState.update(PAGES_RECENTS_KEY, [
            persistanceData,
            ...filteredItems,
        ]);

        pageDataProvider.refresh();
        return;
    }

    const newRecentItems: PagePersistanceData[] = [
        persistanceData,
        ...filteredItems.slice(0, maximumRecentPages - 1),
    ];

    await context.globalState.update(PAGES_RECENTS_KEY, newRecentItems);

    if (refresh) {
        pageDataProvider.refresh();
    }
    return;
};
