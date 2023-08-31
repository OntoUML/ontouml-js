import {
  OntoumlElement,
  OntoumlType,
  Class,
  Classifier,
  GeneralizationSet,
  Package,
  Relation,
  Project,
  ModelElement,
  PackageableElement
} from '..';

export class Generalization extends ModelElement implements PackageableElement {
  general?: Classifier<any, any>;
  specific?: Classifier<any, any>;
  // TODO: add function to enable _genSets to be private
  _genSets: GeneralizationSet[] = [];

  constructor(project: Project, container: Package | undefined) {
    super(project, container);
  }

  public get genSets(): GeneralizationSet[] {
    return [...this._genSets];
  }

  public override get container(): Package | undefined {
    return this.container as Package;
  }

  public override set container(newContainer: Package | undefined) {
    super.container = newContainer;
  }

  // Move this to OntoumlElement as a default implementation.
  getContents(): OntoumlElement[] {
    return [];
  }

  // TODO: Fix this to update references
  // getGeneralizationSets(): GeneralizationSet[] {
  //   let root : Package | null = this.getRoot();

  //   if(!root){
  //     throw new Error('Root package is null. Cannot retrieve generalizations.');
  //   }
  //   return root.getGeneralizationSets()
  //              .filter(gs => gs.generalizations && gs.generalizations.includes(this));
  // }

  // TODO: check the need for these assertions considering that general and specific are mandatory
  assertFieldsDefined() {
    this.assertSpecificDefined();
    this.assertGeneralDefined();
  }

  assertSpecificDefined() {
    if (!this.specific) {
      throw new Error(
        'The `specific` field of this generalization set is not defined.'
      );
    }
  }

  assertGeneralDefined() {
    if (!this.specific) {
      throw new Error(
        'The `general` field of this generalization set is not defined.'
      );
    }
  }

  involvesClasses(): boolean {
    this.assertFieldsDefined();
    return this.general instanceof Class && this.specific instanceof Class;
  }

  involvesRelations(): boolean {
    this.assertFieldsDefined();
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
