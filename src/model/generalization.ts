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
  ProjectElement
} from '..';

/**
 * A generalization ("is-a" relationship) between two {@link Classifier}
 * instances, asserting that every instance of the {@link specific} classifier
 * is also an instance of the {@link general} classifier. For example, a
 * generalization from `Person` (general) to `Student` (specific) states that
 * every student is a person.
 *
 * Generalizations may connect either two classes or two relations, and can be
 * grouped into {@link GeneralizationSet} instances to express disjointness
 * and completeness constraints.
 */
export class Generalization extends ModelElement {
  /** The classifier whose instances include all instances of {@link specific}. */
  general: Classifier<any, any>;

  /** The classifier whose instances are all instances of {@link general}. */
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

  /** The generalization sets in which this generalization is grouped. */
  public get generalizationSets(): GeneralizationSet[] {
    return [...this._generalizationSets];
  }

  /** The package that contains this generalization, if any. */
  public override get container(): Package | undefined {
    return this._container as Package;
  }

  /**
   * @returns `true` if both {@link general} and {@link specific} are
   *          {@link Class} instances.
   */
  involvesClasses(): boolean {
    return this.general instanceof Class && this.specific instanceof Class;
  }

  /**
   * @returns `true` if both {@link general} and {@link specific} are
   *          {@link Relation} instances.
   */
  involvesRelations(): boolean {
    return (
      this.general instanceof Relation && this.specific instanceof Relation
    );
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
