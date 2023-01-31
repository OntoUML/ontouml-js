import { ModelElement, Package } from '../ontouml';
import { ServiceOptions } from '../service_options';
export declare class Ontouml2GufoOptions implements ServiceOptions {
    format: string;
    baseIri: string;
    basePrefix: string;
    uriFormatBy: string;
    createObjectProperty: boolean;
    createInverses: boolean;
    prefixPackages: boolean;
    customElementMapping?: {
        [key: string]: {
            label?: {
                [key: string]: string;
            };
            uri?: string;
        };
    };
    customPackageMapping?: {
        [key: string]: {
            prefix?: string;
            uri?: string;
        };
    };
    constructor(base?: Partial<Ontouml2GufoOptions>);
    getCustomUri(element: ModelElement): string;
    getCustomLabels(element: ModelElement): {
        [key: string]: string;
    } | null;
    getCustomPackagePrefix(pkg: Package): string;
    getCustomPackageUri(pkg: Package): string;
}
