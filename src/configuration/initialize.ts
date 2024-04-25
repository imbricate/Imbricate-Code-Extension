/**
 * @author WMXPY
 * @namespace Configuration
 * @description Initialize
 */

import { IImbricateConfiguration, IImbricateConfigurationOrigin, ImbricateOriginInitializer, ImbricateOriginManager } from "@imbricate/local-fundamental";
import { FileSystemImbricateOrigin, FileSystemOriginPayload } from "@imbricate/origin-file-system";

export const initializeOriginManager = (
    configuration: IImbricateConfiguration,
): ImbricateOriginManager => {

    const originInitializer: ImbricateOriginInitializer = ImbricateOriginInitializer.create();

    originInitializer.registerOriginConstructor(
        "file-system",
        (origin: IImbricateConfigurationOrigin) => {
            return FileSystemImbricateOrigin.withPayloads(
                origin.payloads as FileSystemOriginPayload,
            );
        }
    );

    const originManager = originInitializer.initializeOrigins(configuration.origins);

    return originManager;
};
