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

// TODO: check whether the first generics term "T" is really necessary; it seems redundant
/**
 * The abstract base class of the model elements that can have instances and,
 * thus, can be specialized via {@link Generalization} — namely
 * {@link Class} and {@link Relation}. A classifier owns a list of
 * {@link Property} instances (attributes, in the case of classes; relation
 * ends, in the case of relations) and offers navigation methods over the
 * generalization hierarchy in which it participates.
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

  // TODO: Update methods to use references instead.
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
   */
  getAncestors(knownAncestors: T[] = []): T[] {
    const ancestors = [...knownAncestors];

    // TODO: Replace with flatMap
    this.getParents().forEach(parent => {
      if (!ancestors.includes(parent)) {
        ancestors.push(parent);
        ancestors.push(...parent.getAncestors(ancestors));
      }
    });

    return [...new Set(ancestors)];
  }

  /**
   * Retrieves the direct and indirect subtypes of this classifier.
   */
  getDescendants(knownDescendants: T[] = []): T[] {
    const descendants = [...knownDescendants];

    // TODO: Replace with flatMap
    this.getChildren().forEach((child: T) => {
      if (!descendants.includes(child)) {
        descendants.push(child);
        descendants.push(...child.getDescendants(descendants));
      }
    });

    return [...new Set(descendants)];
  }

  // TODO: Update with references
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
   * Retrieves the relations connected to the ancestors of this classifier.
   */
  getAllRelations(): Relation[] {
    let relations = this.getAncestors().flatMap(a => a.getRelations());
    return [...new Set(relations)];
  }

  /**
   * Retrieves the binary relations whose target is an ancestor of this
   * classifier.
   */
  getAllIncomingRelations(): BinaryRelation[] {
    return this.getAncestors().flatMap(a => a.getIncomingRelations());
  }

  /**
   * Retrieves the binary relations whose source is an ancestor of this
   * classifier.
   */
  getAllOutgoingRelations(): BinaryRelation[] {
    return this.getAncestors().flatMap(a => a.getOutgoingRelations());
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
   * to the ancestors of this classifier.
   */
  getAllNaryRelations(): NaryRelation[] {
    return this.getAncestors().flatMap(a => a.getNaryRelations());
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
