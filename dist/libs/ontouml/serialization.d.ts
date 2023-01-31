import { OntoumlElement } from '.';
declare function validate(element: OntoumlElement): true | object | PromiseLike<any>;
declare function validate(serializedProject: object): true | object | PromiseLike<any>;
declare function validate(serializedProject: string): true | object | PromiseLike<any>;
declare function revive(_key: any, value: any): any;
declare function parse(serializedElement: string, validateElement?: boolean): OntoumlElement;
export declare const serializationUtils: {
    validate: typeof validate;
    revive: typeof revive;
    parse: typeof parse;
    schemas: {
        'https://ontouml.org/ontouml-schema/2021-02-26/Project': any;
        'https://ontouml.org/ontouml-schema/2021-02-26/Package': any;
        'https://ontouml.org/ontouml-schema/2021-02-26/Class': any;
        'https://ontouml.org/ontouml-schema/2021-02-26/Relation': any;
        'https://ontouml.org/ontouml-schema/2021-02-26/Generalization': any;
        'https://ontouml.org/ontouml-schema/2021-02-26/GeneralizationSet': any;
        'https://ontouml.org/ontouml-schema/2021-02-26/Property': any;
        'https://ontouml.org/ontouml-schema/2021-02-26/Literal': any;
        'https://ontouml.org/ontouml-schema/2021-02-26/Diagram': any;
        'https://ontouml.org/ontouml-schema/2021-02-26/ClassView': any;
        'https://ontouml.org/ontouml-schema/2021-02-26/RelationView': any;
        'https://ontouml.org/ontouml-schema/2021-02-26/GeneralizationView': any;
        'https://ontouml.org/ontouml-schema/2021-02-26/GeneralizationSetView': any;
        'https://ontouml.org/ontouml-schema/2021-02-26/PackageView': any;
        'https://ontouml.org/ontouml-schema/2021-02-26/RectangleShape': any;
        'https://ontouml.org/ontouml-schema/2021-02-26/TextShape': any;
        'https://ontouml.org/ontouml-schema/2021-02-26/PathShape': any;
        'https://ontouml.org/ontouml-schema/2021-02-26/definitions': any;
    };
    typeToSchemaId: {
        [x: string]: string;
        definitions: string;
    };
};
export {};
