import {
  OntoumlElement,
  OntoumlType,
  Class,
  Classifier,
  GeneralizationSet,
  Package,
  Relation,
  Project,
  ModelElement
} from '..';

export class Generalization extends ModelElement {
  general: Classifier<any, any>;
  specific: Classifier<any, any>;
  _generalizationSets: Set<GeneralizationSet> = new Set();

  constructor(
    project: Project,
    general: Classifier<any, any>,
    specific: Classifier<any, any>
  ) {
    super(project);
    this.general = general;
    this.specific = specific;
  }

  public get generalizationSets(): GeneralizationSet[] {
    return [...this._generalizationSets];
  }

  public override get container(): Package | undefined {
    return this._container as Package;
  }

  // Move this to OntoumlElement as a default implementation.
  getContents(): OntoumlElement[] {
    return [];
  }

  involvesClasses(): boolean {
    return this.general instanceof Class && this.specific instanceof Class;
  }

  involvesRelations(): boolean {
    return (
      this.general instanceof Relation && this.specific instanceof Relation
    );
  }

  clone(): Generalization {
    return { ...this };
  }

  // TODO: Fixme
  replace(originalElement: ModelElement, newElement: ModelElement): void {
    // if (this.container === originalElement) {
    //   this.container = newElement as Package;
    // }
    // if (this.general === originalElement) {
    //   this.general = newElement as Classifier<any, any>;
    // }
    // if (this.specific === originalElement) {
    //   this.specific = newElement as Classifier<any, any>;
    // }
  }

  override toJSON(): any {
    const object = {
      type: OntoumlType.GENERALIZATION,
      general: this.general?.id,
      specific: this.specific?.id
    };

    return { ...super.toJSON(), ...object };
  }

  // FIXME
  override resolveReferences(
    elementReferenceMap: Map<string, OntoumlElement>
  ): void {
    // super.resolveReferences(elementReferenceMap);
    // const { general, specific } = this;
    // if (general) {
    //   this.general = OntoumlElement.resolveReference(general, elementReferenceMap, this, 'general');
    // }
    // if (specific) {
    //   this.specific = OntoumlElement.resolveReference(specific, elementReferenceMap, this, 'specific');
    // }
  }
}
