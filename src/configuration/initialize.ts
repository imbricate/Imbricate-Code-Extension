/**
 * @author WMXPY
 * @namespace Configuration
 * @description Initialize
 */

import { IImbricateConfiguration, IImbricateConfigurationOrigin, ImbricateOriginInitializer, ImbricateOriginManager } from "@imbricate/local-fundamental";
import { FileSystemImbricateOrigin, FileSystemOriginPayload } from "@imbricate/origin-file-system";
import { MongoImbricateOrigin } from "@imbricate/origin-mongo";
import { SimpleFileSystemImbricateOrigin, SimpleFileSystemOriginPayload } from "@imbricate/origin-simple-file-system";
import { logInfo } from "../util/output-channel";
import { CONFIG_KEY, getConfiguration } from "./get-config";

export const initializeOriginManager = async (
    configuration: IImbricateConfiguration,
): Promise<ImbricateOriginManager> => {

    const originInitializer: ImbricateOriginInitializer = ImbricateOriginInitializer.create();

    originInitializer.registerOriginConstructor(
        "file-system",
        (origin: IImbricateConfigurationOrigin) => {
            return FileSystemImbricateOrigin.withPayloads(
                origin.payloads as FileSystemOriginPayload,
            );
        },
    );

    originInitializer.registerOriginConstructor(
        "mongo",
        (origin: IImbricateConfigurationOrigin) => {
            return MongoImbricateOrigin.create(
                origin.payloads.connectionString as string,
            );
        },
    );

    originInitializer.registerOriginConstructor(
        "simple-file-system",
        (origin: IImbricateConfigurationOrigin) => {
            return SimpleFileSystemImbricateOrigin.withPayload(
                origin.payloads as SimpleFileSystemOriginPayload,
            );
        },
    );

    const originManager = originInitializer.initializeOrigins(configuration.origins);

    const documentDirectories: string[] =
        getConfiguration(CONFIG_KEY.WORKSPACE_DIRECTORY_DOCUMENT);

    if (documentDirectories.length === 0) {
        logInfo("No Document Directories");
    } else {
        logInfo(`Document Directories: ${documentDirectories.join(", ")}`);
    }

    return originManager;
};
