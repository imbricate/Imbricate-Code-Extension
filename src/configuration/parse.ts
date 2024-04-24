/**
 * @author WMXPY
 * @namespace Configuration
 * @description Parse
 */

import { IImbricateConfiguration } from "./definition";
import { IRawImbricateConfiguration } from "./raw-definition";

export const parseRawImbricateConfiguration = (
    configuration: Partial<IRawImbricateConfiguration>,
): IImbricateConfiguration => {

    return {

        origins: configuration.origins
            ? Array.isArray(configuration.origins)
                ? configuration.origins
                : [configuration.origins]
            : [],
    };
};
