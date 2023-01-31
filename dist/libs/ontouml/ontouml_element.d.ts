import { OntoumlType, MultilingualText, Project } from '.';
export declare abstract class OntoumlElement {
    type: OntoumlType;
    id: string;
    name: MultilingualText;
    description: MultilingualText;
    project: Project;
    container: OntoumlElement;
    constructor(type: string, base?: Partial<OntoumlElement>);
    getName(language?: string): string;
    addName(value: string, language?: string): void;
    setName(value: string, language?: string): void;
    getDescription(language?: string): string;
    addDescription(value: string, language?: string): void;
    setDescription(value: string, language?: string): void;
    getNameOrId(language?: string): string;
    getReference(): {
        type: OntoumlType;
        id: string;
    };
    setContainer(container: OntoumlElement): void;
    setProject(project: Project): void;
    getAllContents(): OntoumlElement[];
    abstract getContents(): OntoumlElement[];
    toJSON(): any;
    abstract resolveReferences(elementReferenceMap: Map<string, OntoumlElement>): void;
    static resolveReference<T extends OntoumlElement>(reference: T, elementReferenceMap: Map<string, OntoumlElement>, container?: OntoumlElement, field?: string): T;
}
