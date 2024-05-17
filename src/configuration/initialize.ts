/**
 * @author WMXPY
 * @namespace Configuration
 * @description Initialize
 */

import { IImbricateConfiguration, IImbricateConfigurationOrigin, ImbricateOriginInitializer, ImbricateOriginManager } from "@imbricate/local-fundamental";
import { FileSystemImbricateOrigin, FileSystemOriginPayload } from "@imbricate/origin-file-system";
import { MongoImbricateOrigin } from "@imbricate/origin-mongo";

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

    const originManager = originInitializer.initializeOrigins(configuration.origins);
    return originManager;
};
