/**
 * @author WMXPY
 * @namespace Features
 * @description IO
 */

import { SandboxFeature, SandboxFeatureBuilder } from "@imbricate/core";
import { showScriptPrintMessage } from "../util/show-message";

export const createIOFeatures = (): SandboxFeature[] => {

    return [
        SandboxFeatureBuilder.providedByInterface()
            .withPackageName("io")
            .withMethodName("print")
            .withImplementation((...content: any[]) => {

                const message: string = content.join(" ");
                showScriptPrintMessage(message);
            })
            .build(),
    ];
};
