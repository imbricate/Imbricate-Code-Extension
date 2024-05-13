/**
 * @author WMXPY
 * @namespace Util
 * @description Path
 */

import * as Path from "path";

export const getFileNameAndExtension = (filePath: string): string => {

    const parsedPath: Path.ParsedPath = Path.parse(filePath);
    return parsedPath.base;
};
