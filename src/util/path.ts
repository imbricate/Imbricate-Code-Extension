/**
 * @author WMXPY
 * @namespace Util
 * @description Path
 */

import * as Path from "path";
import * as vscode from "vscode";

export const getFileNameAndExtension = (filePath: string): string => {

    const parsedPath: Path.ParsedPath = Path.parse(filePath);
    return parsedPath.base;
};

export const buildFileUri = (path: string): vscode.Uri => {

    if (path.startsWith("file://")) {

        return vscode.Uri.parse(path);
    }

    const fileRoot: string = `file://${path}`;
    return vscode.Uri.parse(fileRoot);
};
