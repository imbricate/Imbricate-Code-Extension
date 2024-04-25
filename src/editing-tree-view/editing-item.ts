/**
 * @author WMXPY
 * @namespace PagesTreeView
 * @description Editing Item
 */

import { IImbricateOrigin } from "@imbricate/core";
import { ActiveEditing, getActiveEditingReference } from "@imbricate/local-fundamental";
import * as vscode from "vscode";

export class EditingEditingItem extends vscode.TreeItem {

    public static withActiveEditing(
        activeEditing: ActiveEditing,
    ) {

        return new EditingEditingItem(activeEditing);
    }

    private readonly _activeEditing: ActiveEditing;

    private constructor(
        activeEditing: ActiveEditing,
    ) {

        const reference = getActiveEditingReference(activeEditing);
        super(reference, 0);
        this.contextValue = "editing-item";

        this.iconPath = new vscode.ThemeIcon('settings-edit');
        this.command = {
            command: 'imbricate.editing.resume',
            title: 'Resume Editing',
            arguments: [activeEditing],
        };

        this._activeEditing = activeEditing;
    }

    public get activeEditing(): ActiveEditing {
        return this._activeEditing;
    }
}
