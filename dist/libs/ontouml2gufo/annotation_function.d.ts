import { ModelElement, Relation } from '../ontouml';
import { Ontouml2Gufo } from './';
export declare function transformAnnotations(transformer: Ontouml2Gufo, element: ModelElement): boolean;
export declare function transformInverseAnnotations(transformer: Ontouml2Gufo, relation: Relation): void;
