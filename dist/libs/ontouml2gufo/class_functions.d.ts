import { Class } from '../ontouml';
import { Ontouml2Gufo } from './';
export declare function transformClass(transformer: Ontouml2Gufo, _class: Class): boolean;
export declare function transformClassAsIndividual(transformer: Ontouml2Gufo, _class: Class): boolean;
export declare function transformClassAsClass(transformer: Ontouml2Gufo, classElement: Class): void;
export declare function transformEnumeration(transformer: Ontouml2Gufo, classElement: Class): void;
export declare function getCollectiveGufoParent(classElement: Class): string;
export declare function getGufoParentFromAllowed(classElement: Class): GufoParentSettings;
interface GufoParentSettings {
    parentUri: string;
    unionOf: string[];
}
export declare function getGufoParents(classElement: Class): GufoParentSettings;
export declare function writeDisjointnessAxioms(transformer: Ontouml2Gufo, classes: Class[]): boolean;
export {};
