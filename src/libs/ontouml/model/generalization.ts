import { OntoumlElement } from '../ontouml_element';
import { OntoumlType } from '../ontouml_type';
import { Class } from './class';
import { Classifier } from './classifier';
import { GeneralizationSet } from './generalization_set';
import { ModelElement } from './model_element';
import { Package } from './package';
import { Relation } from './relation';

export class Generalization extends ModelElement {
  general: Classifier<any, any>;
  specific: Classifier<any, any>;

  constructor(base?: Partial<Generalization>) {
    super(OntoumlType.GENERALIZATION_TYPE, base);

    this.general = this.general || null;
    this.specific = this.specific || null;
  }

  getContents(): OntoumlElement[] {
    return [];
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
}
