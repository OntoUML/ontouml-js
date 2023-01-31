import { DiagramElement } from '..';
import { OntoumlElement } from '../ontouml_element';
export declare abstract class Shape extends DiagramElement {
    constructor(type: string, base?: Partial<Shape>);
    resolveReferences(_elementReferenceMap: Map<string, OntoumlElement>): void;
}
