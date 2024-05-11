/**
 * @author WMXPY
 * @namespace Origin
 * @description Gather Origin Input
 */

import { IImbricateOrigin } from "@imbricate/core";
import { ImbricateOriginManager, ImbricateOriginManagerOriginResponse } from "@imbricate/local-fundamental";
import * as vscode from "vscode";

type OriginTypeItem = {
    readonly origin: IImbricateOrigin;
} & vscode.QuickPickItem;

export const gatherOriginInput = async (
    originManager: ImbricateOriginManager,
): Promise<IImbricateOrigin | null> => {

    const disposables: vscode.Disposable[] = [];
    try {

        const origins = originManager.origins;

        return await new Promise<IImbricateOrigin | null>((
            resolve: (value: IImbricateOrigin | null) => void,
        ) => {

            let current: OriginTypeItem | null = null;

            const quickPick = vscode.window.createQuickPick();
            quickPick.title = "Create Imbricate Origin";

            const items: OriginTypeItem[] = origins.map((
                origin: ImbricateOriginManagerOriginResponse,
            ) => {

                return {
                    label: origin.originName,
                    detail: origin.origin.originType,
                    origin: origin.origin,
                };
            });

            quickPick.items = items;

            disposables.push(
                quickPick.onDidChangeSelection((items) => {
                    current = items[0] as OriginTypeItem | null;
                }),
            );
            disposables.push(
                quickPick.onDidHide(() => {
                    quickPick.dispose();
                    resolve(null);
                }),
            );
            disposables.push(
                quickPick.onDidAccept(() => {

                    if (!current) {
                        quickPick.hide();
                        resolve(null);
                        return;
                    }

                    resolve(current.origin);
                    quickPick.hide();
                }),
            );

            quickPick.show();
        });
    } finally {

        disposables.forEach(disposable => disposable.dispose());
    }
};
