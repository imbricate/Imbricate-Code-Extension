/**
 * @author WMXPY
 * @namespace Configuration
 * @description IO
 */

import { attemptMarkDir, pathExists, readTextFile, writeTextFile } from "@sudoo/io";
import * as Path from "path";
import { concatConfigurationPath } from "../util/directory-concat";
import { formatJSON } from "../util/format-json";
import { IImbricateConfiguration } from "./definition";
import { parseRawImbricateConfiguration } from "./parse";
import { IRawImbricateConfiguration, getDefaultRawImbricateConfiguration } from "./raw-definition";

const createOrGetFile = async (
    path: string,
    defaultValue: string,
): Promise<string> => {

    const fileExist: boolean = await pathExists(path);

    if (fileExist) {
        return await readTextFile(path);
    }

    const folderPath = Path.dirname(path);

    await attemptMarkDir(folderPath);
    await writeTextFile(path, defaultValue);

    return defaultValue;
};

export const readCLIConfiguration = async (
    configurationPath: string,
): Promise<IImbricateConfiguration> => {

    const configurationFilePath: string = concatConfigurationPath(
        configurationPath,
    );

    const configurationText: string = await createOrGetFile(
        configurationFilePath,
        formatJSON(getDefaultRawImbricateConfiguration()),
    );

    const configuration: IRawImbricateConfiguration = JSON.parse(configurationText);
    const parsedConfiguration: IImbricateConfiguration =
        parseRawImbricateConfiguration(configuration);

    return parsedConfiguration;
};
