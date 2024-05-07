/**
 * @author WMXPY
 * @namespace SourceControl
 * @description Quick Diff Provider
 */

import * as vscode from "vscode";
import { concatEditingOriginalUrl } from "../virtual-document/editing-original/concat";

export class ImbricateQuickDiffProvider implements vscode.QuickDiffProvider {

    public provideOriginalResource(
        uri: vscode.Uri,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.Uri> {

        const identifierList = uri.path.match(/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/);

        if (!identifierList) {
            return;
        }

        const identifier: string | undefined = identifierList[0];

        if (!identifier) {
            return;
        }

        return concatEditingOriginalUrl(
            identifier,
        );
    }
}
