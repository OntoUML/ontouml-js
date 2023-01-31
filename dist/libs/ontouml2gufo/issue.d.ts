import { ModelElement, Relation, Class, Property } from '../ontouml';
import { ServiceIssue } from '../service_issue';
import { ServiceIssueSeverity } from '../service_issue_severity';
export declare const IssueType: {
    INVALID_BASE_IRI: {
        code: string;
        severity: any;
        title: string;
    };
    INVALID_CUSTOM_PACKAGE_PREFIX: {
        code: string;
        severity: any;
        title: string;
    };
    INVALID_CUSTOM_PACKAGE_URI: {
        code: string;
        severity: any;
        title: string;
    };
    INVALID_PACKAGE_PREFIX: {
        code: string;
        severity: any;
        title: string;
    };
    INVALID_PACKAGE_URI: {
        code: string;
        severity: any;
        title: string;
    };
    MISSING_RELATION_NAME: {
        code: string;
        severity: any;
        title: string;
    };
    MISSING_INVERSE_RELATION_NAME: {
        code: string;
        severity: any;
        title: string;
    };
    MISSING_SOURCE_CARDINALITY: {
        code: string;
        severity: any;
        title: string;
    };
    MISSING_TARGET_CARDINALITY: {
        code: string;
        severity: any;
        title: string;
    };
    DUPLICATE_NAMES: {
        code: string;
        severity: any;
        title: string;
    };
    MISSING_ATTRIBUTE_TYPE: {
        code: string;
        severity: any;
        title: string;
    };
};
export declare class Issue implements ServiceIssue {
    id: string;
    code: string;
    title: string;
    description: string;
    severity: ServiceIssueSeverity;
    data: any;
    constructor(base: Partial<Issue>);
    static createInvalidBaseIri(baseIri: string): Issue;
    static createInvalidCustomPackagePrefix(prefix: string, forbiddenPrefixes: string[], packageEl: any): Issue;
    static createInvalidCustomPackageUri(uri: string, packageEl: any): Issue;
    static createInvalidPackagePrefix(prefix: string, forbiddenPrefixes: string[]): Issue;
    static createInvalidPackageUri(uri: string): Issue;
    static createMissingRelationName(relation: Relation): Issue;
    static createMissingInverseRelationName(relation: Relation): Issue;
    static createMissingSourceCardinality(relation: Relation): Issue;
    static createMissingTargetCardinality(relation: Relation): Issue;
    static createDuplicateNames(repeatedElements: ModelElement[], duplicateName: string): Issue;
    static createMissingAttributeType(classEl: Class, attribute: Property): Issue;
    static getElementData(element: any): {
        element: {
            id: any;
            name: any;
        };
    };
    static getIdName(element: any): {
        id: any;
        name: any;
    };
}
