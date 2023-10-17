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
   * Creates a relation end and appends at the end of the property list.
   *
   * @param member - classifier for the property type
   * */
  private createRelationEnd(member: Classifier<any, any>): Property {
    const memberEnd = new Property(this.project!, member);
    this._properties.push(memberEnd);
    memberEnd._container = this;

    return memberEnd;
  }

  assertProperties() {
    if (!Array.isArray(this.properties)) {
      throw new Error('The `properties` field is null or undefined.');
    }
  }

  assertTypedMember(position: number) {
    const member = this.getMember(position);

    if (!member) {
      throw new Error(
        `The type of member end ${position} of the relation is undefined.`
      );
    }
  }

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

  assertHoldsBetweenClasses() {
    if (!this.holdsBetweenClasses()) {
      throw new Error('The relation does not hold between classes.');
    }
  }

  getContents(): OntoumlElement[] {
    return [...this.properties];
  }

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

  getMember(position: number): Classifier<any, any> | undefined {
    return this.getMemberEnd(position).propertyType;
  }

  getMemberAsClass(position: number): Class {
    if (!this.memberIsClass(position)) {
      throw new Error(`The member ${position} of the relation is not a class.`);
    }

    return this.getMember(position) as Class;
  }

  getMembers(): Classifier<any, any>[] {
    this.assertTypedProperties();
    let members = this.properties.map(prop => prop.propertyType!) || [];
    return [...new Set(members)];
  }

  /**
   * @returns true if ${@param classifier} is the type of at least one of the properties of the relation.
   */
  involves(classifier: Classifier<any, any>): boolean {
    return this.getMembers().some(m => m == classifier);
  }

  memberIsClass(position: number): boolean {
    this.assertTypedMember(position);
    return this.getMember(position) instanceof Class;
  }

  isBinary(): boolean {
    this.assertProperties();
    return this.properties?.length === 2;
  }

  isNary(): boolean {
    this.assertProperties();
    return this.properties?.length > 2;
  }

  isMaterial(): boolean {
    return this.stereotype === RelationStereotype.MATERIAL;
  }

  holdsBetweenClasses(): boolean {
    this.assertTypedProperties();
    return this.getMembers().every(m => m instanceof Class);
  }

  holdsBetweenEvents(): boolean {
    this.assertTypedProperties();

    return this.getMembers().every(m => m instanceof Class && m.isEvent());
  }

  holdsBetweenMoments(): boolean {
    this.assertTypedProperties();

    return this.getMembers().every(m => m instanceof Class && m.isMomentType());
  }

  holdsBetweenSubstantials(): boolean {
    this.assertTypedProperties();

    return this.getMembers().every(
      m => m instanceof Class && m.isSubstantialType()
    );
  }

  clone(): Relation {
    const clone = { ...this };

    if (clone.properties) {
      clone.properties = clone.properties.map((attribute: Property) =>
        attribute.clone()
      );
    }

    return clone;
  }

  replace(originalElement: ModelElement, newElement: ModelElement): void {
    if (this.container === originalElement) {
      this._container = newElement as Package;
    }

    this.getContents()
      .map(content => content as ModelElement)
      .forEach(content => content.replace(originalElement, newElement));
  }
}
