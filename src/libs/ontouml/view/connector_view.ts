import { ModelElement, ElementView, Path } from '..';
import { OntoumlElement } from '../ontouml_element';

export abstract class ConnectorView<T extends ModelElement> extends ElementView<T, Path> {
  source: ElementView<any, any>;
  target: ElementView<any, any>;

  constructor(type: string, base?: Partial<ConnectorView<T>>) {
    super(type, base);

    this.source = base?.source || null;
    this.target = base?.target || null;
  }

  createShape(): Path {
    return new Path();
  }

  toJSON(): any {
    const serialization = {
      source: null,
      target: null
    };

    Object.assign(serialization, super.toJSON());

    serialization.source = this.source?.getReference();
    serialization.target = this.target?.getReference();

    return serialization;
  }

  resolveReferences(elementReferenceMap: Map<string, OntoumlElement>): void {
    super.resolveReferences(elementReferenceMap);

    const { source, target } = this;

    if (source) {
      this.source = OntoumlElement.resolveReference(source, elementReferenceMap, this, 'source');
    }

    if (target) {
      this.target = OntoumlElement.resolveReference(target, elementReferenceMap, this, 'target');
    }
  }
}
