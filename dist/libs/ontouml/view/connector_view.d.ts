import { ModelElement, ElementView, Path } from '..';
import { OntoumlElement } from '../ontouml_element';
export declare abstract class ConnectorView<T extends ModelElement> extends ElementView<T, Path> {
    source: ElementView<any, any>;
    target: ElementView<any, any>;
    constructor(type: string, base?: Partial<ConnectorView<T>>);
    createShape(): Path;
    toJSON(): any;
    resolveReferences(elementReferenceMap: Map<string, OntoumlElement>): void;
}
