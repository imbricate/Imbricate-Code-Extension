/**
 * @author WMXPY
 * @namespace Util
 * @description Directory Concat
 */

import { concatDirectory } from "./directory";

export const concatConfigurationPath = (configurationPath: string): string => {

    return concatDirectory(
        configurationPath,
        "imbricate.config.json",
    );
};
