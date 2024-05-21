/**
 * @author WMXPY
 * @namespace Execute
 * @description Execute
 */

import { IImbricateOrigin, IImbricateScript } from "@imbricate/core";
import { END_SIGNAL, MarkedResult } from "@sudoo/marked";
import { showErrorMessage } from "../util/show-message";
import { prepareInterfaceFeatures } from "./prepare-features";

export const executeImbricateScript = async (
    origin: IImbricateOrigin,
    script: IImbricateScript,
): Promise<MarkedResult | null> => {

    const interfaceFeatures = prepareInterfaceFeatures(origin);

    const executeResult: MarkedResult | null = await script.execute(
        interfaceFeatures,
        {},
        {},
    );

    if (!executeResult) {
        showErrorMessage(`Failed to execute script: ${script.scriptName}`);
        return null;
    }

    if (executeResult.signal !== END_SIGNAL.SUCCEED) {

        showErrorMessage(`Failed to execute script: ${script.scriptName}`);
        return null;
    }

    return executeResult;
};
