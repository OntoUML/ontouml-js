import { Relation, ModelElement } from '../ontouml';
import { Ontouml2Gufo } from './';
export declare class UriManager {
    transformer: Ontouml2Gufo;
    id2Uri: {
        [key: string]: string;
    };
    uniqueUris: string[];
    constructor(transformer: Ontouml2Gufo);
    getUri(element: any): string;
    getSourceUri(relation: Relation): string;
    getTargetUri(relation: Relation): string;
    uriExists(uri: string): boolean;
    saveUri(element: ModelElement, uri: string): void;
    generateUniqueUris(): void;
    getUniqueUriVariation(originalUri: string): string;
    getUriFromId(element: ModelElement): string;
    getFixedUri(element: ModelElement): any;
    getUriFromTaggedValues(element: any): any;
    getUriFromOptions(element: ModelElement): string;
    getNameBasedUri(element: ModelElement): string;
    getRelationNameBasedUri(relation: Relation): string;
    getInverseRelationUri(relation: Relation): string;
    getInverseRelationNameBasedUri(relation: Relation): string;
    getPrefix(element: ModelElement): string;
}
export declare function normalizeName(name: string): string;
export declare const getNormalizedName: (element: any) => string;
export declare const getUriFromXsdMapping: (element: any) => string;
