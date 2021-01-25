import { Relation, Class, ModelElement, containerUtils, Package, GeneralizationSet, OntoumlType } from './';

export class Generalization extends ModelElement {
  general: Class | Relation;
  specific: Class | Relation;

  constructor(base?: Partial<Generalization>) {
    super(base);

    Object.defineProperty(this, 'type', { value: OntoumlType.GENERALIZATION_TYPE, enumerable: true });
  }

  toJSON(): any {
    const generalizationSerialization: any = {
      general: null,
      specific: null
    };

    Object.assign(generalizationSerialization, super.toJSON());

    const general = this.general;
    const specific = this.specific;
    generalizationSerialization.general = general ? general.getReference() : null;
    generalizationSerialization.specific = specific ? specific.getReference() : null;

    return generalizationSerialization;
  }

  setContainer(newContainer: Package): void {
    containerUtils.setContainer(this, newContainer, 'contents', true);
  }

  getGeneralizationSets(): GeneralizationSet[] {
    return this.getModelOrRootPackage()
      .getAllGeneralizationSets()
      .filter((genset: GeneralizationSet) => genset.generalizations && genset.generalizations.includes(this));
  }

  involvesClasses(): boolean {
    return this.general instanceof Class && this.specific instanceof Class;
  }

  involvesRelations(): boolean {
    return this.general instanceof Relation && this.specific instanceof Relation;
  }

  clone(): Generalization {
    return new Generalization(this);
  }

  replace(originalElement: ModelElement, newElement: ModelElement): void {
    if (this.container === originalElement) {
      this.container = newElement as Package;
    }

    if (this.general === (originalElement as Class | Relation)) {
      this.general = newElement as Class | Relation;
    }

    if (this.specific === (originalElement as Class | Relation)) {
      this.specific = newElement as Class | Relation;
    }
  }

  getGeneralClass(): Class {
    if (this.general instanceof Class) {
      return this.general;
    } else {
      throw new Error("The generalization's general is not an instance of Class.");
    }
  }

  getGeneralRelation(): Relation {
    if (this.general instanceof Relation) {
      return this.general;
    } else {
      throw new Error("The generalization's general is not an instance of Relation.");
    }
  }

  getSpecificClass(): Class {
    if (this.specific instanceof Class) {
      return this.specific;
    } else {
      throw new Error("The generalization's specific is not an instance of Class.");
    }
  }

  getSpecificRelation(): Relation {
    if (this.specific instanceof Relation) {
      return this.specific;
    } else {
      throw new Error("The generalization's specific is not an instance of Relation.");
    }
  }
}
