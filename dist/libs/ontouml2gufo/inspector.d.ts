import { Ontouml2Gufo, Issue } from './';
export declare class Inspector {
    transformer: Ontouml2Gufo;
    issues: Issue[];
    constructor(transformer: Ontouml2Gufo);
    run(): Issue[];
    checkBaseIri(): void;
    checkPackagePrefixes(): void;
    checkRelationNames(): void;
    checkRepeatedNames(): void;
    checkCardinality(): void;
    checkAttributeType(): void;
}
