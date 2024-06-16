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

export const getLastFolderName = (filePath: string): string => {

    const parsedPath: Path.ParsedPath = Path.parse(filePath);
    return parsedPath.name;
};

export const compareFilePath = (first: string, second: string): boolean => {

    const firstUri: vscode.Uri = vscode.Uri.file(first);
    const secondUri: vscode.Uri = vscode.Uri.file(second);

    return firstUri.fsPath === secondUri.fsPath;
};
