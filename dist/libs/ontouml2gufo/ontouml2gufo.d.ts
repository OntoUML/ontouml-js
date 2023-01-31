import { Project, Package, Relation } from '../ontouml';
import { Issue, Ontouml2GufoOptions, Inspector, UriManager } from './';
import { Quad, Writer } from 'n3';
import { Service, ServiceIssue } from './..';
export declare class Ontouml2Gufo implements Service {
    model: Package;
    options: Ontouml2GufoOptions;
    inspector: Inspector;
    owlCode: string;
    writer: Writer;
    uriManager: UriManager;
    constructor(project: Project, options?: Partial<Ontouml2GufoOptions>);
    constructor(model: Package, options?: Partial<Ontouml2GufoOptions>);
    constructor(project: Project, options?: Partial<Ontouml2GufoOptions>);
    constructor(input: Project | Package, options?: Partial<Ontouml2GufoOptions>);
    getIssues(): Issue[];
    getOwlCode(): string;
    getUri(element: any): string;
    getInverseRelationUri(element: any): string;
    getSourceUri(relation: Relation): string;
    getTargetUri(relation: Relation): string;
    addQuad(subject: any, predicate?: any, object?: any): void;
    addLiteralQuad(subject: string, predicate: string, literalValue: string, language?: string): void;
    addQuads(quads: Quad[]): void;
    transform(): boolean;
    initializeWriter(): void;
    writePreamble(): void;
    transformClasses(): boolean;
    transformAttributes(): void;
    transformRelations(): void;
    transformCardinalities(): void;
    transformGeneralizations(): void;
    transformGeneralizationSets(): void;
    run(): {
        result: any;
        issues?: ServiceIssue[];
    };
}
