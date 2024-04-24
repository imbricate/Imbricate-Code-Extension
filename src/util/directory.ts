/**
 * @author WMXPY
 * @namespace Util
 * @description Directory Resolve
 */

import * as Path from "path";

export const resolveDirectory = (...paths: string[]): string => {

    const resolvedPath: string = Path.resolve(...paths);

    return resolvedPath;
};

export const concatDirectory = (...paths: string[]): string => {

    const resolvedPath: string = Path.join(...paths);

    return resolvedPath;
};
