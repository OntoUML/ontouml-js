import {
  ClassifierBuilder,
  RelationStereotype,
  NaryRelation,
  Classifier
} from '../..';

/**
 * A fluent builder for {@link NaryRelation} instances.
 *
 * This builder configures the members connected by the relation (at least
 * three classifiers) and its OntoUML stereotype, offering shortcut methods
 * for the stereotypes applicable to n-ary relations, namely `material()`
 * and `comparative()`.
 *
 * @example
 * ```typescript
 * const treatedIn = project
 *   .naryRelationBuilder()
 *   .material()
 *   .name('treated in')
 *   .members(patient, hospital, disease)
 *   .build();
 * ```
 */
export class NaryRelationBuilder extends ClassifierBuilder<
  NaryRelationBuilder,
  RelationStereotype
> {
  declare element?: NaryRelation;
  private _members: Classifier<any, any>[] = [];

  /**
   * Builds an instance of {@link NaryRelation} with the parameters passed to
   * the builder. At least three members are required before `build()` is
   * evoked. **WARNING:** the ordering in which methods are evoked may affect
   * the resulting object. When no methods are evoked, the created relation
   * has the following defaults:
   * - `id: "randomly-generated-id",`
   * - `created: new Date(),`
   * - `isAbstract: false,`
   * - `isDerived: false,`
   */
  override build(): NaryRelation {
    this.assertNotBuilt();

    if (this._members.length < 3) {
      throw new Error(
        'Cannot build an n-ary relation without at least 3 members.'
      );
    }

    this.assertSameProject(this._container, ...this._members);

    this.element = new NaryRelation(this.project, this._members);
    this.element.properties.forEach(end => this.project.add(end));

    super.build();

    return this.element;
  }

  /**
   * Sets the {@link Classifier} instances connected by the ends of the
   * relation, replacing any previously set members. At least three members
   * are required to build the relation.
   *
   * @returns this builder, for method chaining.
   */
  members(...members: Classifier<any, any>[]): NaryRelationBuilder {
    this._members = [...members];
    return this;
  }

  /**
   * Sets the stereotype of the relation, delegating to the corresponding
   * shortcut method (`material()` or `comparative()`) when the value is a
   * {@link RelationStereotype} applicable to n-ary relations, in which case
   * the default values of the stereotype are also applied.
   *
   * @param stereotype - the stereotype to decorate the relation with.
   * @returns this builder, for method chaining.
   */
  override stereotype(stereotype: string): NaryRelationBuilder {
    switch (stereotype) {
      case RelationStereotype.MATERIAL:
        return this.material();
      case RelationStereotype.COMPARATIVE:
        return this.comparative();
    }

    return super.stereotype(stereotype);
  }

  /**
   * Sets the stereotype of the relation to «material», which decorates
   * relations between endurants that are founded on relators, such as being
   * treated in. Also applies the following defaults:
   * - `isDerived = true`
   *
   * @returns this builder, for method chaining.
   */
  material(): NaryRelationBuilder {
    this._stereotype = RelationStereotype.MATERIAL;
    this.derived();
    return this;
  }

  /**
   * Sets the stereotype of the relation to «comparative», which decorates
   * relations that hold between endurants by virtue of a comparison of their
   * intrinsic aspects. Also applies the following defaults:
   * - `isDerived = true`
   *
   * @returns this builder, for method chaining.
   */
  comparative(): NaryRelationBuilder {
    this._stereotype = RelationStereotype.COMPARATIVE;
    this.derived();
    return this;
  }
}
