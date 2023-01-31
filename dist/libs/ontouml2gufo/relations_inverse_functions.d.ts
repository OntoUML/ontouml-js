import { Relation } from '../ontouml';
import { Ontouml2Gufo } from './';
export declare function getPartWholeSuperPropertyInverse(relation: Relation): string;
export declare function getSuperPropertyFromStereotypeInverse(relation: Relation): string;
export declare function getInverseSuperProperty(relation: Relation): string;
export declare function transformInverseRelation(transformer: Ontouml2Gufo, relation: Relation): void;
