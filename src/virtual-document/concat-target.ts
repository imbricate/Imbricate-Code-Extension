/**
 * @author WMXPY
 * @namespace VirtualDocument
 * @description Concat Target
 */

import { SAVING_TARGET_TYPE, SavingTarget } from "@imbricate/local-fundamental";
import * as vscode from "vscode";
import { concatPageMarkdownUrl } from "./page-markdown/concat";
import { concatScriptJavascriptUrl } from "./script-javascript/concat";

export const concatSavingTargetUrl = (
    savingTarget: SavingTarget<any>,
): vscode.Uri => {

    switch (savingTarget.type) {
        case SAVING_TARGET_TYPE.PAGE: {

            const fixedTarget: SavingTarget<SAVING_TARGET_TYPE.PAGE> = savingTarget;

            const uri = concatPageMarkdownUrl(
                fixedTarget.payload.origin,
                fixedTarget.payload.collection,
                fixedTarget.payload.collection,
                fixedTarget.payload.identifier,
            );

            return uri;
        }
        case SAVING_TARGET_TYPE.SCRIPT: {

            const fixedTarget: SavingTarget<SAVING_TARGET_TYPE.SCRIPT> = savingTarget;

            const uri = concatScriptJavascriptUrl(
                fixedTarget.payload.origin,
                fixedTarget.payload.identifier,
            );

            return uri;
        }
    }

    throw new Error("[Imbricate] Invalid Saving Target");
};
