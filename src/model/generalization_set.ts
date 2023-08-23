import {
  OntoumlElement,
  OntoumlType,
  Class,
  Classifier,
  Generalization,
  Package,
  Relation,
  Project,
} from "..";
import { utils } from "..";
import { PackageableElement } from "./packageable_element";
import { ModelElement } from "./model_element";

export class GeneralizationSet
  extends ModelElement
  implements PackageableElement
{
  isDisjoint: boolean = false;
  isComplete: boolean = false;
  categorizer?: Class;
  private _generalizations: Generalization[] = [];

  constructor(project: Project, container?: Package) {
    super(project, container);
  }

  public get generalizations(): Generalization[] {
    return [...this._generalizations];
  }

  // FIXME: TEST me
  public set generalizations(generalizations: Generalization[]) {
    this._generalizations.forEach((g) => utils.removeById(g._genSets, this));

    this.generalizations.forEach((g) => g._genSets.push(this));
    this._generalizations = generalizations;
  }

  public override get container(): Package | undefined {
    return this.container as Package;
  }

  public override set container(newContainer: Package | undefined) {
    super.container = newContainer;
  }

  getContents(): OntoumlElement[] {
    return [];
  }

  /**
   * @returns true if the generalization set is disjoint and complete.
   */
  isPartition(): boolean {
    return this.isComplete && this.isDisjoint;
  }

  /**
   *
   * @returns true if the generalization set is disjoint, complete, and for all its generalizations g, g.specific points to a class stereotyped as a «phase».
   */
  isPhasePartition(): boolean {
    //FIXME: Simplify me!
    return (
      this.isPartition() &&
      this.involvesClasses() &&
      ((this.getSpecificsAsClasses().every((specific) => specific.isPhase()) &&
        this.getGeneralAsClass().isSortal()) ||
        (this.getSpecificsAsClasses().every((specific) =>
          specific.isPhaseMixin(),
        ) &&
          this.getGeneralAsClass().isCategory()))
    );
  }

  /**
   *
   * @returns true if the generalization set is disjoint, complete, and for all its generalizations g, g.specific points to a class stereotyped as a «phase».
   */
  isSubkindPartition(): boolean {
    //FIXME: Simplify me!
    return (
      this.isPartition() &&
      this.involvesClasses() &&
      this.getSpecificsAsClasses().every((specific) => specific.isSubkind()) &&
      this.getGeneralAsClass().isSortal()
      //
    );
  }

  /**
   * @returns the classifier that is
   * @throws exception if different generals are present or if there are no generalizations in this set.
   */
  getGeneral(): Classifier<any, any> {
    this.assertDefinedGeneralizations();
    this.assertUniqueGeneral();

    return this.generalizations[0].general!;
  }

  getSpecifics(): Classifier<any, any>[] {
    if (!Array.isArray(this.generalizations)) {
      throw new Error(
        "The field `generalizations` should be an array: " +
          this.generalizations,
      );
    }

    this.generalizations.forEach((g) => g.assertSpecificDefined());
    let specifics = this.generalizations.map(
      (g) => g.specific as Classifier<any, any>,
    );

    return Array.from(new Set(specifics));
  }

  getGeneralAsClass(): Class {
    if (!this.involvesClasses()) {
      throw new Error("Generalization set does not involve classes");
    }

    return this.getGeneral() as Class;
  }

  getSpecificsAsClasses(): Class[] {
    if (!this.involvesClasses()) {
      throw new Error("Generalization set does not involve classes");
    }

    return this.getSpecifics() as Class[];
  }

  getGeneralAsRelation(): Relation {
    if (!this.involvesRelations()) {
      throw new Error("Generalization set does not involve relations");
    }

    return this.getGeneral() as Relation;
  }

  getSpecificsAsRelations(): Relation[] {
    if (!this.involvesRelations()) {
      throw new Error("Generalization set does not involve relations");
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
    this.assertDefinedGeneralizations();
    return this.generalizations.every((g) => g.involvesClasses());
  }

  involvesRelations(): boolean {
    this.assertDefinedGeneralizations();
    return this.generalizations.every((g) => g.involvesRelations());
  }

  assertUniqueGeneral() {
    const general = this.generalizations[0].general;
    const hasMultipleGenerals = this.generalizations.some(
      (g) => g.general !== general,
    );

    if (hasMultipleGenerals) {
      throw new Error(
        "Generalization set involving distinct general classifiers",
      );
    }

    return general;
  }

  assertDefinedGeneralizations() {
    if (!this.generalizations) {
      throw new Error("Generalization array is null.");
    }

    if (this.generalizations.length == 0) {
      throw new Error("Generalization array is empty.");
    }

    this.generalizations.every((g) => g.assertFieldsDefined());
  }

  //FIX ME
  clone(): GeneralizationSet {
    let clone = { ...this };
    return clone;
  }

  replace(originalElement: ModelElement, newElement: ModelElement): void {
    // if (this.container === originalElement) {
    //   this.container = newElement as Package;
    // }
    // if (this.categorizer === originalElement) {
    //   this.categorizer = newElement as Class;
    // }
    // if (this.generalizations && this.generalizations.includes(originalElement as any)) {
    //   this.generalizations = this.generalizations.map((gen: Generalization) =>
    //     gen === originalElement ? (newElement as Generalization) : gen
    //   );
    // }
  }

  /** Get instantiation relations where the categorizer (or one of its ancestors) is the source */
  getInstantiationRelations(): Relation[] | undefined {
    return this.categorizer
      ?.getIncomingRelations()
      .filter((r) => r.isInstantiation());
  }

  override toJSON(): any {
    const object: any = {
      type: OntoumlType.GENERALIZATION_SET,
      isDisjoint: this.isDisjoint,
      isComplete: this.isComplete,
      categorizer: this.categorizer?.id || null,
      generalizations: this._generalizations.map((g) => g.id),
    };

    return { ...object, ...super.toJSON() };
  }

  override resolveReferences(
    elementReferenceMap: Map<string, OntoumlElement>,
  ): void {
    super.resolveReferences(elementReferenceMap);

    const { categorizer, generalizations } = this;

    if (categorizer) {
      this.categorizer = OntoumlElement.resolveReference(
        categorizer,
        elementReferenceMap,
        this,
        "categorizer",
      );
    }

    if (Array.isArray(generalizations)) {
      this.generalizations = generalizations.map(
        (generalization: Generalization) =>
          OntoumlElement.resolveReference(
            generalization,
            elementReferenceMap,
            this,
            "generalizations",
          ),
      );
    }
  }
}
