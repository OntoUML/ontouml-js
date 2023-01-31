import { Ontouml2Gufo } from './';
export declare const DefaultPrefixes: {
    gufo: string;
    rdf: string;
    rdfs: string;
    owl: string;
    xsd: string;
};
export declare const getPrefixes: (ontouml2gufo: Ontouml2Gufo) => {
    gufo: string;
    rdf: string;
    rdfs: string;
    owl: string;
    xsd: string;
};
export declare const getBasePrefix: (ontouml2gufo: Ontouml2Gufo) => {};
export declare const getPackagePrefixes: (ontouml2gufo: Ontouml2Gufo) => {};
export declare const getPackagePrefix: (ontouml2gufo: Ontouml2Gufo, pkg: any) => string;
export declare const getPackageUri: (ontouml2gufo: Ontouml2Gufo, pkg: any) => string;
