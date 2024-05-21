/**
 * @author WMXPY
 * @namespace Execute
 * @description Prepare Features
 */

import { IImbricateOrigin, SandboxFeature } from "@imbricate/core";
import { createIOFeatures } from "../features/io";

export const prepareInterfaceFeatures = (
    _currentOrigin: IImbricateOrigin,
): SandboxFeature[] => {

    const interfaceFeatures: SandboxFeature[] = [
        ...createIOFeatures(),
    ];

    return interfaceFeatures;
};
