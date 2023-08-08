import { OntoumlElement, OntoumlType, Class, Classifier, GeneralizationSet, ModelElement, Package, Relation } from '..';

export class Generalization extends ModelElement {
  general?: Classifier<any, any>;
  specific?: Classifier<any, any>;

  constructor(base?: Partial<Generalization>) {
    super(OntoumlType.GENERALIZATION_TYPE, base);

    this.general = base?.general;
    this.specific = base?.specific;
  }

  getContents(): OntoumlElement[] {
    return [];
  }

  // TODO: Fix this to update references
  getGeneralizationSets(): GeneralizationSet[] {
    let root : Package | null = this.getRoot();
    
    if(!root){
      throw new Error('Root package is null. Cannot retrieve generalizations.');
    }
    return root.getAllGeneralizationSets()
               .filter(gs => gs.generalizations && gs.generalizations.includes(this));
  }

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
    return new Generalization(this);
  }

  replace(originalElement: ModelElement, newElement: ModelElement): void {
    if (this.container === originalElement) {
      this.container = newElement as Package;
    }

    if (this.general === originalElement) {
      this.general = newElement as Classifier<any, any>;
    }

    if (this.specific === originalElement) {
      this.specific = newElement as Classifier<any, any>;
    }
  }

  getGeneralClass(): Class {
    if (this.general instanceof Class) {
      return this.general;
    } 
    
    throw new Error("The generalization's general is not an instance of Class.");
  }

  getGeneralRelation(): Relation {
    if (this.general instanceof Relation) {
      return this.general;
    }
    
    throw new Error("The generalization's general is not an instance of Relation.");
  }

  getSpecificClass(): Class {
    if (this.specific instanceof Class) {
      return this.specific;
    }
    
    throw new Error("The generalization's specific is not an instance of Class.");
  }

  getSpecificRelation(): Relation {
    if (this.specific instanceof Relation) {
      return this.specific;
    }
    
    throw new Error("The generalization's specific is not an instance of Relation.");
  }

  toJSON(): any {
    const object: any = {
      general: null,
      specific: null
    };

    Object.assign(object, super.toJSON());

    const general = this.general;
    const specific = this.specific;
    object.general = general ? general.getReference() : null;
    object.specific = specific ? specific.getReference() : null;

    return object;
  }

  resolveReferences(elementReferenceMap: Map<string, OntoumlElement>): void {
    super.resolveReferences(elementReferenceMap);

    const { general, specific } = this;

    if (general) {
      this.general = OntoumlElement.resolveReference(general, elementReferenceMap, this, 'general');
    }

    if (specific) {
      this.specific = OntoumlElement.resolveReference(specific, elementReferenceMap, this, 'specific');
    }
  }
}
