import _ from 'lodash';
import {
  Package,
  Stereotype,
  Generalization,
  GeneralizationSet,
  Property,
  Class,
  Relation,
  Project,
  BinaryRelation,
  NaryRelation,
  Decoratable
} from '..';

/**
 * The abstract base class of the model elements that can have instances and,
 * thus, can be specialized via {@link Generalization} — namely
 * {@link Class} and {@link Relation}. A classifier owns a list of
 * {@link Property} instances (attributes, in the case of classes; relation
 * ends, in the case of relations) and offers navigation methods over the
 * generalization hierarchy in which it participates.
 *
 * The self-referential type parameter `T` is the concrete classifier type,
 * so that hierarchy navigation methods (e.g., {@link getParents},
 * {@link getAncestors}) are typed with the subclass: `Class.getParents()`
 * returns `Class[]` and `Relation.getParents()` returns `Relation[]`.
 */
export abstract class Classifier<
  T extends Classifier<T, S>,
  S extends Stereotype
> extends Decoratable<S> {
  /**
   * Indicates whether the classifier is abstract, i.e., whether it can have
   * direct instances.
   */
  isAbstract: boolean = false;

  protected _properties: Property[] = [];

  constructor(project: Project) {
    super(project);
  }

  /** The package that contains this classifier, if any. */
  public override get container(): Package | undefined {
    return this._container as Package;
  }

  /**
   * The properties owned by this classifier: attributes in the case of
   * classes, relation ends in the case of relations.
   */
  public get properties(): Property[] {
    return [...this._properties];
  }

  public set properties(value: Property[]) {
    this._properties = value;
  }

  /**
   * Adds a property to this classifier, setting the classifier as the
   * property's container.
   */
  public addProperty(p: Property): void {
    this._properties.push(p);
    p._container = this;
  }

  /**
   * Removes a property from this classifier, clearing the property's
   * container.
   */
  public removeProperty(p: Property): void {
    this._properties = this._properties.filter(property => property !== p);
    p._container = undefined;
  }

  /**
   * Deletes the elements that cannot exist without this classifier: the
   * relations in which it types an end, the generalizations in which it
   * participates, and its own properties — in addition to the dependents
   * deleted for every model element (anchors and views).
   */
  protected override deleteDependents(): void {
    this.project.relations
      .filter(
        r =>
          (r as Classifier<any, any>) !== this &&
          r.properties.some(p => p.propertyType === this)
      )
      .forEach(r => r.delete());

    this.getGeneralizations().forEach(g => g.delete());
    this.properties.forEach(p => p.delete());

    super.deleteDependents();
  }

  /**
   * Clears the type of the properties typed by this classifier — the
   * attributes whose type it is; the relation ends it types are deleted
   * with their relations — in addition to the reference clean-up performed
   * for every model element.
   */
  protected override removeReferences(): void {
    this.project.properties
      .filter(p => p.propertyType === this)
      .forEach(p => (p.propertyType = undefined));

    super.removeReferences();
  }

  /**
   * Casts this classifier to {@link Class}.
   *
   * @throws an error if the classifier is not a class.
   */
  asClass(): Class {
    if (this instanceof Class) {
      return this as Class;
    }

    throw new Error('The classifier is not an instance of Class.');
  }

  /**
   * Casts this classifier to {@link Relation}.
   *
   * @throws an error if the classifier is not a relation.
   */
  asRelation(): Relation {
    if (this instanceof Relation) {
      return this as Relation;
    }

    throw new Error('The classifier is not an instance of Relation.');
  }

  /**
   * Creates a {@link Generalization} in which this classifier is the
   * specific and the given classifier is the general.
   *
   * @param parent - the classifier to be set as the general.
   * @returns the newly created generalization.
   */
  addParent(parent: T): Generalization {
    return this.project!.generalizationBuilder()
      .general(parent)
      .specific(this)
      .container(this.container)
      .build();
  }

  /**
   * Creates a {@link Generalization} in which this classifier is the
   * general and the given classifier is the specific.
   *
   * @param child - the classifier to be set as the specific.
   * @returns the newly created generalization.
   */
  addChild(child: T): Generalization {
    return this.project!.generalizationBuilder()
      .general(this)
      .specific(child)
      .container(this.container)
      .build();
  }

  /**
   * Retrieves the generalizations in which this classifier participates,
   * either as general or as specific.
   */
  getGeneralizations(): Generalization[] {
    return this.project!.generalizations.filter(
      g => this === g.specific || this === g.general
    );
  }

  /**
   * Retrieves the generalizations in which this classifier is the general.
   */
  getGeneralizationsWhereGeneral(): Generalization[] {
    return this.getGeneralizations().filter(gen => this === gen.general);
  }

  /**
   * Retrieves the generalizations in which this classifier is the specific.
   */
  getGeneralizationsWhereSpecific(): Generalization[] {
    return this.getGeneralizations().filter(gen => this === gen.specific);
  }

  /**
   * Retrieves the generalization sets that involve this classifier, whether
   * as general, specific, or categorizer.
   */
  getGeneralizationSets(): GeneralizationSet[] {
    return this.project!.generalizationSets.filter(gs =>
      gs.getInvolvedClassifiers().includes(this)
    );
  }

  /**
   * Retrieves the generalization sets in which this classifier is the
   * general.
   */
  getGeneralizationSetsWhereGeneral(): GeneralizationSet[] {
    return this.getGeneralizationSets().filter(gs => gs.getGeneral() === this);
  }

  /**
   * Retrieves the generalization sets in which this classifier is one of the
   * specifics.
   */
  getGeneralizationSetsWhereSpecific(): GeneralizationSet[] {
    return this.getGeneralizationSets().filter(gs =>
      gs.getSpecifics().includes(this)
    );
  }

  /** Retrieves the direct supertypes of this classifier. */
  getParents(): T[] {
    return this.getGeneralizations()
      .filter(g => this === g.specific)
      .map(g => g.general) as T[];
  }

  /** Retrieves the direct subtypes of this classifier. */
  getChildren(): T[] {
    return this.getGeneralizations()
      .filter(g => this === g.general)
      .map(g => g.specific) as T[];
  }

  /**
   * Retrieves the direct and indirect supertypes of this classifier.
   *
   * @throws an error if the classifier is part of a circular generalization
   *         chain (e.g., `A` specializes `B`, `B` specializes `C`, and `C`
   *         specializes `A`), in which case the classifier would be an
   *         ancestor of itself.
   */
  getAncestors(knownAncestors: T[] = []): T[] {
    const ancestors = new Set(knownAncestors);
    const queue = this.getParents();

    while (queue.length > 0) {
      const ancestor = queue.shift()!;

      if ((ancestor as Classifier<any, any>) === this) {
        throw new Error(
          `Circular generalization chain: classifier '${this.id}' is an ancestor of itself.`
        );
      }

      if (!ancestors.has(ancestor)) {
        ancestors.add(ancestor);
        queue.push(...ancestor.getParents());
      }
    }

    return [...ancestors];
  }

  /**
   * Retrieves the direct and indirect subtypes of this classifier.
   *
   * @throws an error if the classifier is part of a circular generalization
   *         chain (e.g., `A` specializes `B`, `B` specializes `C`, and `C`
   *         specializes `A`), in which case the classifier would be a
   *         descendant of itself.
   */
  getDescendants(knownDescendants: T[] = []): T[] {
    const descendants = new Set(knownDescendants);
    const queue = this.getChildren();

    while (queue.length > 0) {
      const descendant = queue.shift()!;

      if ((descendant as Classifier<any, any>) === this) {
        throw new Error(
          `Circular generalization chain: classifier '${this.id}' is a descendant of itself.`
        );
      }

      if (!descendants.has(descendant)) {
        descendants.add(descendant);
        queue.push(...descendant.getChildren());
      }
    }

    return [...descendants];
  }

  /**
   * Retrieves the relations connected to this classifier, i.e., those in
   * which the classifier is the type of at least one relation end.
   */
  getRelations(): Relation[] {
    return this.project.relations.filter(r => r.getMembers().includes(this));
  }

  /**
   * Retrieves the binary relations whose target is this classifier.
   */
  getIncomingRelations(): BinaryRelation[] {
    return this.project.binaryRelations.filter(r => r.target === this);
  }

  /**
   * Retrieves the binary relations whose source is this classifier.
   */
  getOutgoingRelations(): BinaryRelation[] {
    return this.project.binaryRelations.filter(r => r.source === this);
  }

  /**
   * Retrieves the relations connected to this classifier or to one of its
   * ancestors.
   */
  getAllRelations(): Relation[] {
    const classifiers: Classifier<any, any>[] = [this, ...this.getAncestors()];
    const relations = classifiers.flatMap(c => c.getRelations());
    return [...new Set(relations)];
  }

  /**
   * Retrieves the binary relations whose target is this classifier or one
   * of its ancestors.
   */
  getAllIncomingRelations(): BinaryRelation[] {
    const classifiers: Classifier<any, any>[] = [this, ...this.getAncestors()];
    return classifiers.flatMap(c => c.getIncomingRelations());
  }

  /**
   * Retrieves the binary relations whose source is this classifier or one
   * of its ancestors.
   */
  getAllOutgoingRelations(): BinaryRelation[] {
    const classifiers: Classifier<any, any>[] = [this, ...this.getAncestors()];
    return classifiers.flatMap(c => c.getOutgoingRelations());
  }

  /**
   * Retrieves the high-arity relations (see {@link NaryRelation}) connected
   * to this classifier.
   */
  getNaryRelations(): NaryRelation[] {
    return this.getRelations().filter(r => r.isNary());
  }

  /**
   * Retrieves the high-arity relations (see {@link NaryRelation}) connected
   * to this classifier or to one of its ancestors.
   */
  getAllNaryRelations(): NaryRelation[] {
    const classifiers: Classifier<any, any>[] = [this, ...this.getAncestors()];
    const relations = classifiers.flatMap(c => c.getNaryRelations());
    return [...new Set(relations)];
  }

  /**
   * Retrieves the «derivation» relations connected to this classifier.
   *
   * @throws currently unimplemented.
   */
  getOwnDerivations(): BinaryRelation[] {
    throw new Error('Method unimplemented!');
  }

  /**
   * Retrieves the «derivation» relations connected to this classifier or to
   * one of its ancestors.
   *
   * @throws currently unimplemented.
   */
  getAllDerivations(): BinaryRelation[] {
    throw new Error('Method unimplemented!');
  }

  /**
   * Retrieves the opposite ends of the relations connected to this
   * classifier or to one of its ancestors.
   *
   * @throws currently unimplemented.
   */
  getAllOppositeRelationEnds(): Property[] {
    throw new Error('Method unimplemented!');
  }

  /**
   * Retrieves the opposite ends of the relations connected to this
   * classifier.
   *
   * @throws currently unimplemented.
   */
  getOwnOppositeRelationEnds(): Property[] {
    throw new Error('Method unimplemented!');
  }

  override toJSON(): any {
    const object = {
      isAbstract: this.isAbstract,
      properties: this.properties.map(p => p.id)
    };

    return { ...super.toJSON(), ...object };
  }
}
