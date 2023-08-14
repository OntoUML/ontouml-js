import { OntoumlElement, OntoumlType, Class, Classifier, GeneralizationSet, ModelElement, Package, Relation, Project } from '..';
import { PackageableElement } from './packageable_element';

export class Generalization extends ModelElement implements PackageableElement {
  general: Classifier<any, any>;
  specific: Classifier<any, any>;
  _genSets: GeneralizationSet[] = [];
  
  constructor(project: Project, container: Package | undefined, general: Classifier<any, any>, specific: Classifier<any,any>) {
    super(project, container);

    this.general = general;
    this.specific = specific;
  }

  public get genSets(): GeneralizationSet[] {
    return [...this._genSets];
  }

  public override get container(): Package | undefined {
    return this.container as Package
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

  assertFieldsDefined() {
    this.assertSpecificDefined();
    this.assertGeneralDefined();
  }
  
  assertSpecificDefined() {
    if(!this.specific) { 
      throw new Error("The `specific` field of this generalization set is not defined.");
    }  
  }
  
  assertGeneralDefined() {
    if(!this.specific) { 
      throw new Error("The `general` field of this generalization set is not defined.");
    }  
  }

  involvesClasses(): boolean {
    this.assertFieldsDefined();
    return this.general instanceof Class && this.specific instanceof Class;
  }

  involvesRelations(): boolean {
    this.assertFieldsDefined();
    return this.general instanceof Relation && this.specific instanceof Relation;
  }

  clone(): Generalization {
    const clone = new Generalization(this.project!, this.container, this.specific, this.general);
    return clone;
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
      general: this.general.id,
      specific: this.specific.id
    };

    return { ...object, ...super.toJSON() };
  }

  // FIXME
  override resolveReferences(elementReferenceMap: Map<string, OntoumlElement>): void {
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
