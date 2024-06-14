/**
 * @author WMXPY
 * @namespace Origin
 * @description Gather Origin Type
 */

import * as vscode from "vscode";

type OriginTypeItem = {
    readonly originType: string;
} & vscode.QuickPickItem;

export const gatherOriginTypeInput = async (): Promise<string | null> => {

    const disposables: vscode.Disposable[] = [];
    try {

        return await new Promise<string | null>((
            resolve: (value: string | null) => void,
        ) => {

            let current: OriginTypeItem | null = null;

            const quickPick = vscode.window.createQuickPick();
            quickPick.title = "Create Imbricate Origin";

            const items: OriginTypeItem[] = [{
                label: "File System",
                detail: "Create a file system origin",
                originType: "file-system",
            }, {
                label: "Mongo",
                detail: "Create a mongodb origin",
                originType: "mongo",
            }, {
                label: "Simple File System",
                detail: "Create a simple file system origin",
                originType: "simple-file-system",
            }];
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

                    resolve(current.originType);
                    quickPick.hide();
                }),
            );

            quickPick.show();
        });
    } finally {

        disposables.forEach(disposable => disposable.dispose());
    }
};
