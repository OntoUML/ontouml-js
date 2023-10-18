import {
  ClassifierBuilder,
  RelationStereotype,
  NaryRelation,
  Classifier,
  MATERIAL,
  COMPARATIVE
} from '../..';

export class NaryRelationBuilder extends ClassifierBuilder<
  NaryRelationBuilder,
  RelationStereotype
> {
  override element?: NaryRelation;
  private _members: Classifier<any, any>[] = [];

  /**
   * Builds an instance of {@link NaryRelation} with the parameters passed to the builder. **WARNING:** the ordering in which methods are evoked may affect the resulting object. When no methods are evoked, the created class has the following defaults:
   * - `id: "randomly-generated-id",`
   * - `created: new Date(),`
   * - `isAbstract: false,`
   * - `isDerived: false,`
   */
  override build(): NaryRelation {
    if (this._members.length < 3) {
      throw new Error(
        'Cannot build an n-ary relation without at least 3 members.'
      );
    }

    this.element = new NaryRelation(this.project, this._members);

    super.build();

    return this.element;
  }

  members(...members: Classifier<any, any>[]): NaryRelationBuilder {
    this._members = [...members];
    return this;
  }

  /**
   * Sets the stereotype field and set default values in case of a known ClassStereotype.
   */
  override stereotype(stereotype: string): NaryRelationBuilder {
    switch (stereotype) {
      case MATERIAL:
        return this.material();
      case COMPARATIVE:
        return this.comparative();
    }

    return super.stereotype(stereotype);
  }

  /**
   * Sets the stereotype of the binary relation to «material» and default values:
   * - isDerived = true
   *
   * The values assigned to all relation ends are:
   * - isReadOnly = false
   * - isOrdered = false
   * - multiplicty = 0..*
   * - aggregationKind = NONE
   */
  material(): NaryRelationBuilder {
    this._stereotype = MATERIAL;
    this.derived();
    return this;
  }

  /**
   * Sets the stereotype of the binary relation to «comparative» and default values:
   * - isDerived = true
   *
   * The values assigned to the source and target end are:
   * - isReadOnly = false
   * - isOrdered = false
   * - multiplicty = 0..*
   * - aggregationKind = NONE
   */
  comparative(): NaryRelationBuilder {
    this._stereotype = COMPARATIVE;
    this.derived();
    return this;
  }
}
