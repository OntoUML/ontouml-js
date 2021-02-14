import { OntoumlElement } from '../ontouml_element';
import { OntoumlType } from '../ontouml_type';
import { Class } from './class';
import { Classifier } from './classifier';
import { Generalization } from './generalization';
import { ModelElement } from './model_element';
import { Package } from './package';
import { Relation } from './relation';

export class GeneralizationSet extends ModelElement {
  isDisjoint: boolean;
  isComplete: boolean;
  categorizer: Class;
  generalizations: Generalization[];

  constructor(base?: Partial<GeneralizationSet>) {
    super(OntoumlType.GENERALIZATION_SET_TYPE, base);

    this.isDisjoint = this.isDisjoint || false;
    this.isComplete = this.isComplete || false;
  }

  getContents(): OntoumlElement[] {
    return [];
  }

  /**
   * A disjoint complete set of phase subclasses
   */
  isPartition(): boolean {
    return this.isComplete && this.isDisjoint;
  }

  /**
   * @throws exception if different generals are present
   */
  getGeneral(): Classifier<any, any> {
    if (!this.generalizations) {
      return null;
    }

    let general = this.generalizations[0].general;

    if (this.generalizations.some((gen: Generalization) => gen.general !== general)) {
      throw new Error('Generalization set involving distinct general classifiers');
    }

    return general;
  }

  getSpecifics(): Classifier<any, any>[] {
    if (this.generalizations) {
      return this.generalizations.map((gen: Generalization) => gen.specific);
    }

    return [];
  }

  getGeneralClass(): Class {
    if (!this.involvesClasses()) {
      throw new Error('Generalization set does not involve classes');
    }

    return this.getGeneral() as Class;
  }

  getSpecificClasses(): Classifier<any, any>[] {
    if (!this.involvesClasses()) {
      throw new Error('Generalization set does not involve classes');
    }

    return this.getSpecifics() as Class[];
  }

  getGeneralRelation(): Relation {
    if (!this.involvesRelations()) {
      throw new Error('Generalization set does not involve relations');
    }

    return this.getGeneral() as Relation;
  }

  getSpecificRelations(): Relation[] {
    if (!this.involvesRelations()) {
      throw new Error('Generalization set does not involve relations');
    }

    return this.getSpecifics() as Relation[];
  }

  getInvolvedClassifiers(): Classifier<any, any>[] {
    let involvedClassifiers: Classifier<any, any>[] = [];
    const general = this.getGeneral();
    const specifics = this.getSpecifics();

    if (this.categorizer) {
      involvedClassifiers.push(this.categorizer);
    }
    if (general) {
      involvedClassifiers.push(general);
    }
    if (specifics) {
      involvedClassifiers.push(...specifics);
    }

    return involvedClassifiers;
  }

  involvesClasses(): boolean {
    return this.generalizations && this.generalizations.every((gen: Generalization) => gen.involvesClasses());
  }

  involvesRelations(): boolean {
    return this.generalizations && this.generalizations.every((gen: Generalization) => gen.involvesRelations());
  }

  clone(): GeneralizationSet {
    return new GeneralizationSet(this);
  }

  replace(originalElement: ModelElement, newElement: ModelElement): void {
    if (this.container === originalElement) {
      this.container = newElement as Package;
    }

    if (this.categorizer === originalElement) {
      this.categorizer = newElement as Class;
    }

    if (this.generalizations && this.generalizations.includes(originalElement as any)) {
      this.generalizations = this.generalizations.map((gen: Generalization) =>
        gen === originalElement ? (newElement as Generalization) : gen
      );
    }
  }

  /** Get instantiation relations where the categorizer (or one of its ancestors) is the source */
  getInstantiationRelations(): Relation[] {
    throw new Error('Method unimplemented!');
  }

  toJSON(): any {
    const object: any = {
      isDisjoint: false,
      isComplete: false,
      categorizer: null,
      generalizations: null
    };

    Object.assign(object, super.toJSON());

    object.categorizer = this.categorizer && this.categorizer.getReference();
    object.generalizations = [...this.generalizations].map((generalization: Generalization) => generalization.getReference());

    return object;
  }
}
