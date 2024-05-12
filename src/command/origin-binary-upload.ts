/**
 * @author WMXPY
 * @namespace Command
 * @description Origin Binary Upload
 */

import { IImbricateBinaryStorage, IImbricateOrigin } from "@imbricate/core";
import { ImbricateOriginManager } from "@imbricate/local-fundamental";
import { readBufferFile } from "@sudoo/io";
import * as vscode from "vscode";
import { gatherOriginInput } from "../origin/gather-origin-input";
import { gatherTargetFileInput } from "../origin/gather-target-file";
import { getFileNameAndExtension } from "../util/path";

export const registerOriginBinaryUploadCommand = (
    originManager: ImbricateOriginManager,
    _context: vscode.ExtensionContext,
): vscode.Disposable => {

    const disposable = vscode.commands.registerCommand("imbricate.origin.binary.upload", async () => {

        const targetOrigin: IImbricateOrigin | null = await gatherOriginInput(
            originManager,
        );

        if (!targetOrigin) {
            return;
        }

        const targetFile: string | null = await gatherTargetFileInput();

        if (!targetFile) {
            return;
        }

        const binaryStorage: IImbricateBinaryStorage = targetOrigin.getBinaryStorage();

        const file: Buffer = await readBufferFile(targetFile);
        const base64: string = file.toString("base64");

        const validationResult: boolean = await binaryStorage.validateBinaryBase64(base64);

        if (!validationResult) {
            vscode.window.showErrorMessage("Invalid binary file");
            return;
        }

        const fileName: string = getFileNameAndExtension(targetFile);

        const resultUrl: string = await binaryStorage.putBinaryBase64(base64, fileName);
        vscode.env.clipboard.writeText(resultUrl);

        vscode.window.showInformationMessage(`Uploaded to: ${resultUrl}, Copied to clipboard`);
    });

    return disposable;
};
