/**
 * @author WMXPY
 * @namespace Command
 * @description Script Execute
 */

import { IImbricateScript } from "@imbricate/core";
import { END_SIGNAL, MarkedResult } from "@sudoo/marked";
import * as vscode from "vscode";
import { prepareInterfaceFeatures } from "../execute/prepare-features";
import { ScriptScriptItem } from "../scripts-tree-view/script-item";
import { showErrorMessage } from "../util/show-message";

export const registerScriptExecuteCommand = (): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand("imbricate.script.execute", async (
        item: ScriptScriptItem,
    ) => {

        const script: IImbricateScript | null =
            await item.origin.getScript(item.scriptSnapshot.identifier);

        if (!script) {
            showErrorMessage(`Cannot find script: ${item.scriptSnapshot.scriptName}`);
            return;
        }

        const interfaceFeatures = prepareInterfaceFeatures(item.origin);

        const executeResult: MarkedResult | null = await script.execute(
            interfaceFeatures,
            {},
            {},
        );

        if (!executeResult) {
            showErrorMessage(`Failed to execute script: ${item.scriptSnapshot.scriptName}`);
            return;
        }

        if (executeResult.signal !== END_SIGNAL.SUCCEED) {

            showErrorMessage(`Failed to execute script: ${item.scriptSnapshot.scriptName}`);
        }
    });

    return disposable;
};
