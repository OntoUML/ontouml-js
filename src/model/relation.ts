import {
  OntoumlElement,
  Class,
  RelationStereotype,
  ModelElement,
  Package,
  Property,
  Project,
  Classifier
} from '..';

/**
 * A relation between two or more {@link Classifier} instances, such as a
 * `married with` relation between instances of `Person`. Relations are
 * themselves classifiers, whose instances are the links (tuples) connecting
 * instances of the related classifiers.
 *
 * Each connection point of a relation is reified as a {@link Property}
 * called a relation end, whose `propertyType` is the connected classifier
 * (referred to as a member of the relation). Concrete relations are either
 * {@link BinaryRelation} (two ends) or {@link NaryRelation} (three or more
 * ends), and may be decorated with a {@link RelationStereotype}.
 */
export abstract class Relation extends Classifier<
  Relation,
  RelationStereotype
> {
  protected constructor(project: Project, members: Classifier<any, any>[]) {
    super(project);

    if (members.length < 2) {
      throw new Error(
        'At least 2 classifiers are needed to create a relation.'
      );
    }

    members.forEach(member => this.createRelationEnd(member));
  }

  /**
   * Creates a relation end typed by the given classifier and appends it to
   * the end of the property list.
   *
   * @param member - classifier to be set as the type of the new end.
   */
  private createRelationEnd(member: Classifier<any, any>): Property {
    const memberEnd = new Property(this.project!, member);
    this._properties.push(memberEnd);
    memberEnd._container = this;

    return memberEnd;
  }

  /**
   * Asserts that the property list of the relation is an array.
   *
   * @throws an error if the `properties` field is null or undefined.
   */
  assertProperties() {
    if (!Array.isArray(this.properties)) {
      throw new Error('The `properties` field is null or undefined.');
    }
  }

  /**
   * Asserts that the relation end at the given position is typed.
   *
   * @throws an error if the end has no type.
   */
  assertTypedMember(position: number) {
    const member = this.getMember(position);

    if (!member) {
      throw new Error(
        `The type of member end ${position} of the relation is undefined.`
      );
    }
  }

  /**
   * Asserts that every end of the relation is typed.
   *
   * @throws an error if some end has no type.
   */
  assertTypedProperties() {
    this.assertProperties();

    const typeLessProperty = this.properties.find(p => !p.propertyType);

    if (typeLessProperty) {
      throw new Error(
        'A property of the relation does not have a propertyType: ' +
          typeLessProperty
      );
    }
  }

  /**
   * Asserts that every member of the relation is a {@link Class}.
   *
   * @throws an error if some member is not a class.
   */
  assertHoldsBetweenClasses() {
    if (!this.holdsBetweenClasses()) {
      throw new Error('The relation does not hold between classes.');
    }
  }

  /** The relation ends of this relation. */
  override get contents(): ModelElement[] {
    return [...this.properties];
  }

  /**
   * Retrieves the relation end at the given position.
   *
   * @param position - zero-based index of the end.
   * @throws an error if the position is out of bounds.
   */
  getMemberEnd(position: number): Property {
    this.assertProperties();

    if (position < 0 || position >= this.properties.length) {
      throw new Error(
        'Position out of bonds. Position should be greater than 0 and less than ' +
          this.properties.length
      );
    }

    return this.properties[position];
  }

  /**
   * Retrieves the classifier connected at the given position of the
   * relation.
   *
   * @param position - zero-based index of the end.
   */
  getMember(position: number): Classifier<any, any> | undefined {
    return this.getMemberEnd(position).propertyType;
  }

  /**
   * Retrieves the classifier connected at the given position of the
   * relation as a {@link Class}.
   *
   * @param position - zero-based index of the end.
   * @throws an error if the member at the given position is not a class.
   */
  getMemberAsClass(position: number): Class {
    if (!this.memberIsClass(position)) {
      throw new Error(`The member ${position} of the relation is not a class.`);
    }

    return this.getMember(position) as Class;
  }

  /**
   * Retrieves the classifiers connected by this relation, without
   * duplicates.
   *
   * @throws an error if some end of the relation has no type.
   */
  getMembers(): Classifier<any, any>[] {
    this.assertTypedProperties();
    let members = this.properties.map(prop => prop.propertyType!) || [];
    return [...new Set(members)];
  }

  /**
   * Checks whether the given classifier is the type of at least one end of
   * this relation.
   */
  involves(classifier: Classifier<any, any>): boolean {
    return this.getMembers().some(m => m == classifier);
  }

  /**
   * Checks whether the classifier connected at the given position of the
   * relation is a {@link Class}.
   *
   * @param position - zero-based index of the end.
   */
  memberIsClass(position: number): boolean {
    this.assertTypedMember(position);
    return this.getMember(position) instanceof Class;
  }

  /** Checks whether this relation has exactly two ends. */
  isBinary(): boolean {
    this.assertProperties();
    return this.properties?.length === 2;
  }

  /** Checks whether this relation has more than two ends. */
  isNary(): boolean {
    this.assertProperties();
    return this.properties?.length > 2;
  }

  /** Checks whether this relation is stereotyped as «material». */
  isMaterial(): boolean {
    return this.stereotype === RelationStereotype.MATERIAL;
  }

  /**
   * Checks whether every member of this relation is a {@link Class}.
   */
  holdsBetweenClasses(): boolean {
    this.assertTypedProperties();
    return this.getMembers().every(m => m instanceof Class);
  }

  /**
   * Checks whether every member of this relation is a class stereotyped as
   * «event».
   */
  holdsBetweenEvents(): boolean {
    this.assertTypedProperties();

    return this.getMembers().every(m => m instanceof Class && m.isEvent());
  }

  /**
   * Checks whether every member of this relation is a class whose instances
   * are restricted to moment natures (see {@link MomentNatures}).
   */
  holdsBetweenMoments(): boolean {
    this.assertTypedProperties();

    return this.getMembers().every(m => m instanceof Class && m.isMomentType());
  }

  /**
   * Checks whether every member of this relation is a class whose instances
   * are restricted to substantial natures (see {@link SubstantialNatures}).
   */
  holdsBetweenSubstantials(): boolean {
    this.assertTypedProperties();

    return this.getMembers().every(
      m => m instanceof Class && m.isSubstantialType()
    );
  }
}
