/**
 * @author WMXPY
 * @namespace PagesTreeView
 * @description Page Data
 */

import { ImbricatePageSnapshot } from "@imbricate/core";

export const PAGES_FAVORITES_KEY: string = "imbricate.page.favorites";
export const PAGES_RECENTS_KEY: string = "imbricate.page.recents";

export type PagePersistanceData = {

    readonly originName: string;
    readonly collectionUniqueIdentifier: string;
    readonly pageSnapshot: ImbricatePageSnapshot;
};
