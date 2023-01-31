import { OntoumlElement } from '..';
export declare abstract class DiagramElement extends OntoumlElement {
    constructor(type: string, base?: Partial<DiagramElement>);
}
