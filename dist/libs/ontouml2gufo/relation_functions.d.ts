import { Relation } from '../ontouml';
import { Ontouml2Gufo } from './';
export declare function transformRelation(transformer: Ontouml2Gufo, relation: Relation): void;
export declare function getPartWholeSuperProperty(relation: Relation): string;
export declare function getSuperPropertyFromStereotype(relation: Relation): string;
export declare function getSuperProperty(relation: Relation): string;
