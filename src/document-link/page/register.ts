/**
 * @author WMXPY
 * @namespace DocumentLink_Page
 * @description Register
 */

import * as vscode from "vscode";
import { PageDocumentLinkProvider } from "./provider";

export const registerPageDocumentLinkProvider = (
    context: vscode.ExtensionContext,
): void => {

    const provider = PageDocumentLinkProvider.create();

    const providerRegistrations = vscode.Disposable.from(
        vscode.languages.registerDocumentLinkProvider(
            { scheme: "reference" },
            provider,
        ),
    );

    context.subscriptions.push(
        providerRegistrations,
    );
};
