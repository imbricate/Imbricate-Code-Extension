/**
 * @author WMXPY
 * @namespace Util
 * @description Directory Resolve
 */

import { concatDirectory, resolveDirectory } from "./directory";

export const resolveHomeDirectory = (...paths: string[]): string => {

    const homePath: string = process.env.HOME || process.env.USERPROFILE || "~";
    const resolvedPath: string = resolveDirectory(homePath, ...paths);

    return resolvedPath;
};

export const resolveImbricateHomeDirectory = (...paths: string[]): string => {

    const configurationPath: string = resolveHomeDirectory(".imbricate");
    return concatDirectory(configurationPath, ...paths);
};
