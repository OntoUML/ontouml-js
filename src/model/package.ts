import { remove } from 'lodash';
import {
  OntoumlElement,
  OntoumlType,
  utils,
  Class,
  AggregationKind,
  RelationStereotype,
  Generalization,
  GeneralizationSet,
  Relation,
  Classifier,
  Project,
  BinaryRelation,
  NaryRelation,
  ModelElement,
  Link,
  Note
} from '..';

export type PackageableElement =
  | Class
  | Relation
  | Generalization
  | GeneralizationSet
  | Package
  | Link
  | Note;

export class Package extends ModelElement {
  private _contents: PackageableElement[] = [];

  constructor(project: Project, container?: Package) {
    super(project, container);
  }

  public get contents(): PackageableElement[] {
    return [...this._contents];
  }

  // TODO: Check this method
  public set contents(contents: PackageableElement[]) {
    this._contents = [];
    this.addContents(contents);
  }

  public override get container(): Package | undefined {
    return this.container as Package;
  }

  public override set container(newContainer: Package | undefined) {
    super.container = newContainer;
  }

  override getContents(): OntoumlElement[] {
    return this.contents as unknown as OntoumlElement[];
  }

  addContent<T extends PackageableElement>(child: T): T {
    if (child == null) {
      throw new Error('Cannot add null child.');
    }

    if (child.container instanceof Package) {
      child.container.removeContent(child);
    }

    child.container = this;
    this.contents.push(child);
    return child;
  }

  addContents<T extends PackageableElement>(contents: T[]): T[] {
    if (!contents) throw new Error('Cannot add null array.');

    return contents.filter(x => x !== null).map(x => this.addContent(x));
  }

  removeContent<T extends PackageableElement>(child: T): boolean {
    const originalLength = this.contents.length;
    let removed = remove(this.contents, x => child === x);

    return originalLength > removed.length;
  }

  override toJSON(): any {
    const object = {
      type: OntoumlType.PACKAGE,
      contents: this.contents.map(e => e.id)
    };

    return { ...super.toJSON(), ...object };
  }

  createNaryRelation(
    members: Classifier<any, any>[],
    name?: string,
    stereotype?: RelationStereotype
  ): NaryRelation {
    let rel = new NaryRelation(this.project!, this, members);

    if (name) {
      rel.name.addText(name);
    }

    if (stereotype && stereotype != RelationStereotype.MATERIAL) {
      throw new Error(
        'N-ary relations can only be decorated as «material». Provided: ' +
          stereotype
      );
    }

    rel.stereotype = stereotype;

    return this.addContent(rel);
  }

  createBinaryRelation(
    source: Classifier<any, any>,
    target: Classifier<any, any>,
    name?: string,
    stereotype?: RelationStereotype
  ): BinaryRelation {
    let rel = new BinaryRelation(this.project!, this, source, target);

    if (name) {
      rel.name.addText(name);
    }

    if (stereotype) {
      rel.stereotype = stereotype;
    }

    return this.addContent(rel);
  }

  createDerivation(
    relation: Relation,
    truthmaker: Class,
    name?: string
  ): Relation {
    return this.createBinaryRelation(
      relation,
      truthmaker,
      name,
      RelationStereotype.DERIVATION
    );
  }

  createMaterialRelation(
    source: Class,
    target: Class,
    name?: string
  ): Relation {
    const relation = this.createBinaryRelation(
      source,
      target,
      name,
      RelationStereotype.MATERIAL
    );
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    if (target.isRole() || target.isRoleMixin()) {
      sourceEnd.cardinality!.setOneToMany();
    } else {
      sourceEnd.cardinality!.setZeroToMany();
    }

    if (source.isRole() || source.isRoleMixin()) {
      targetEnd.cardinality!.setOneToMany();
    } else {
      targetEnd.cardinality!.setZeroToMany();
    }

    return relation;
  }

  createComparativeRelation(
    source: Class,
    target: Class,
    name?: string
  ): Relation {
    const relation = this.createBinaryRelation(
      source,
      target,
      name,
      RelationStereotype.COMPARATIVE
    );

    const sourceEnd = relation.getSourceEnd();
    sourceEnd.cardinality!.setZeroToOne();
    sourceEnd.isReadOnly = true;

    const targetEnd = relation.getTargetEnd();
    targetEnd.cardinality!.setZeroToOne();
    targetEnd.isReadOnly = true;

    return relation;
  }

  createMediation(source: Class, target: Class, name?: string): Relation {
    const relation = this.createBinaryRelation(
      source,
      target,
      name,
      RelationStereotype.MEDIATION
    );
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    if (target.isRole() || target.isRoleMixin()) {
      sourceEnd.cardinality!.setOneToMany();
    } else {
      sourceEnd.cardinality!.setZeroToMany();
    }

    targetEnd.cardinality!.setOneToOne();
    targetEnd.isReadOnly = true;

    return relation;
  }

  createCharacterization(
    source: Class,
    target: Class,
    name?: string
  ): Relation {
    const relation = this.createBinaryRelation(
      source,
      target,
      name,
      RelationStereotype.CHARACTERIZATION
    );

    relation.getSourceEnd().cardinality?.setOneToOne;

    const targetEnd = relation.getTargetEnd();
    targetEnd.cardinality!.setOneToOne();
    targetEnd.isReadOnly = true;

    return relation;
  }

  createExternalDependence(
    source: Class,
    target: Class,
    name?: string
  ): Relation {
    const relation = this.createBinaryRelation(
      source,
      target,
      name,
      RelationStereotype.EXTERNAL_DEPENDENCE
    );

    relation.getSourceEnd().cardinality?.setZeroToMany();

    const targetEnd = relation.getTargetEnd();
    targetEnd.cardinality!.setOneToMany();
    targetEnd.isReadOnly = true;

    return relation;
  }

  createComponentOf(source: Class, target: Class, name?: string): Relation {
    const relation = this.createBinaryRelation(
      source,
      target,
      name,
      RelationStereotype.COMPONENT_OF
    );

    relation.getSourceEnd().cardinality?.setOneToMany();

    const targetEnd = relation.getTargetEnd();
    targetEnd.cardinality!.setOneToOne();
    targetEnd.aggregationKind = AggregationKind.COMPOSITE;

    return relation;
  }

  createMemberOfRelation(
    source: Class,
    target: Class,
    name?: string
  ): Relation {
    const relation = this.createBinaryRelation(
      source,
      target,
      name,
      RelationStereotype.MEMBER_OF
    );

    const sourceEnd = relation.getSourceEnd();
    sourceEnd.cardinality?.setOneToMany();

    const targetEnd = relation.getTargetEnd();
    targetEnd.cardinality!.setOneToMany();
    targetEnd.aggregationKind = AggregationKind.SHARED;

    return relation;
  }

  createSubCollectionOf(source: Class, target: Class, name?: string): Relation {
    const relation = this.createBinaryRelation(
      source,
      target,
      name,
      RelationStereotype.SUBCOLLECTION_OF
    );

    const sourceEnd = relation.getSourceEnd();
    sourceEnd.cardinality!.setCardinality(1, 1);

    const targetEnd = relation.getTargetEnd();
    targetEnd.cardinality!.setCardinality(1, 1);
    targetEnd.aggregationKind = AggregationKind.COMPOSITE;

    return relation;
  }

  createSubQuantityOf(source: Class, target: Class, name?: string): Relation {
    const relation = this.createBinaryRelation(
      source,
      target,
      name,
      RelationStereotype.SUBQUANTITY_OF
    );
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    sourceEnd.cardinality!.setCardinality(1, 1);
    targetEnd.cardinality!.setCardinality(1, 1);
    targetEnd.aggregationKind = AggregationKind.COMPOSITE;

    return relation;
  }

  createInstantiation(source: Class, target: Class, name?: string): Relation {
    const relation = this.createBinaryRelation(
      source,
      target,
      name,
      RelationStereotype.INSTANTIATION
    );
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    sourceEnd.cardinality!.setZeroToMany();
    targetEnd.cardinality!.setOneToMany();

    return relation;
  }

  createTermination(source: Class, target: Class, name?: string): Relation {
    const relation = this.createBinaryRelation(
      source,
      target,
      name,
      RelationStereotype.TERMINATION
    );
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    sourceEnd.cardinality!.setCardinality(1, 1);
    sourceEnd.isReadOnly = true;
    targetEnd.cardinality!.setCardinality(1, 1);
    targetEnd.isReadOnly = true;

    return relation;
  }

  createParticipational(source: Class, target: Class, name?: string): Relation {
    const relation = this.createBinaryRelation(
      source,
      target,
      name,
      RelationStereotype.PARTICIPATIONAL
    );
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    sourceEnd.cardinality!.setOneToMany();
    sourceEnd.isReadOnly = true;
    targetEnd.cardinality!.setOneToOne();
    targetEnd.isReadOnly = true;
    targetEnd.aggregationKind = AggregationKind.COMPOSITE;

    return relation;
  }

  createParticipation(source: Class, target: Class, name?: string): Relation {
    const relation = this.createBinaryRelation(
      source,
      target,
      name,
      RelationStereotype.PARTICIPATION
    );
    const sourceEnd = relation.getSourceEnd();
    const targetEnd = relation.getTargetEnd();

    sourceEnd.cardinality!.setZeroToOne();
    sourceEnd.isReadOnly = true;

    if (source.isHistoricalRole() || source.isHistoricalRoleMixin()) {
      targetEnd.cardinality!.setOneToMany();
    } else {
      targetEnd.cardinality!.setZeroToMany();
    }

    return relation;
  }

  createHistoricalDependence(
    source: Class,
    target: Class,
    name?: string
  ): Relation {
    const relation = this.createBinaryRelation(
      source,
      target,
      name,
      RelationStereotype.HISTORICAL_DEPENDENCE
    );

    const sourceEnd = relation.getSourceEnd();
    sourceEnd.cardinality!.setZeroToMany();
    sourceEnd.isReadOnly = true;

    const targetEnd = relation.getTargetEnd();
    targetEnd.cardinality!.setOneToOne();

    return relation;
  }

  createCreationRelation(
    source: Class,
    target: Class,
    name?: string
  ): Relation {
    const relation = this.createBinaryRelation(
      source,
      target,
      name,
      RelationStereotype.CREATION
    );

    const sourceEnd = relation.getSourceEnd();
    sourceEnd.cardinality!.setOneToOne();
    sourceEnd.isReadOnly = true;

    const targetEnd = relation.getTargetEnd();
    targetEnd.cardinality!.setOneToOne();
    targetEnd.isReadOnly = true;

    return relation;
  }

  createManifestationRelation(
    source: Class,
    target: Class,
    name?: string
  ): Relation {
    const relation = this.createBinaryRelation(
      source,
      target,
      name,
      RelationStereotype.MANIFESTATION
    );

    const sourceEnd = relation.getSourceEnd();
    sourceEnd.cardinality!.setOneToMany();
    sourceEnd.isReadOnly = true;

    const targetEnd = relation.getTargetEnd();
    targetEnd.cardinality!.setZeroToMany();

    return relation;
  }

  createBringsAboutRelation(
    source: Class,
    target: Class,
    name?: string
  ): Relation {
    const relation = this.createBinaryRelation(
      source,
      target,
      name,
      RelationStereotype.BRINGS_ABOUT
    );

    const sourceEnd = relation.getSourceEnd();
    sourceEnd.cardinality!.setOneToOne();
    sourceEnd.isReadOnly = true;

    const targetEnd = relation.getTargetEnd();
    targetEnd.cardinality!.setOneToOne();
    targetEnd.isReadOnly = true;

    return relation;
  }

  createTriggersRelation(
    source: Class,
    target: Class,
    name?: string
  ): Relation {
    const relation = this.createBinaryRelation(
      source,
      target,
      name,
      RelationStereotype.TRIGGERS
    );

    const sourceEnd = relation.getSourceEnd();
    sourceEnd.cardinality!.setOneToOne();
    sourceEnd.isReadOnly = true;

    const targetEnd = relation.getTargetEnd();
    targetEnd.cardinality!.setOneToOne();

    return relation;
  }

  createPartWholeRelation(
    source: Class,
    target: Class,
    name?: string
  ): Relation {
    const relation = this.createBinaryRelation(source, target, name, undefined);

    const sourceEnd = relation.getSourceEnd();
    sourceEnd.cardinality!.setCardinality(2);

    const targetEnd = relation.getTargetEnd();
    targetEnd.cardinality!.setOneToOne();
    targetEnd.aggregationKind = AggregationKind.COMPOSITE;

    return relation;
  }

  createGeneralization(
    general: Classifier<any, any>,
    specific: Classifier<any, any>,
    name?: string
  ): Generalization {
    this.assertProject();

    let gen = this.project!.generalizationBuilder()
      .general(general)
      .specific(specific)
      .container(this)
      .build();

    if (name) {
      gen.name.addText(name);
    }

    return this.addContent(gen);
  }

  createGeneralizationSet(
    generalizations?: Generalization | Generalization[],
    isDisjoint: boolean = false,
    isComplete: boolean = false,
    name?: string
  ): GeneralizationSet {
    this.assertProject();

    let gs = new GeneralizationSet(this.project!, this);
    gs.isComplete = isComplete;
    gs.isDisjoint = isDisjoint;

    if (generalizations) {
      gs.generalizations = utils.arrayFrom(generalizations);
    }

    if (name) {
      gs.name.addText(name);
    }

    return this.addContent(gs);
  }

  createPartition(
    generalizations: Generalization | Generalization[],
    name?: string
  ): GeneralizationSet {
    return this.createGeneralizationSet(generalizations, true, true, name);
  }

  createPartitionFromClasses(
    general: Class,
    specifics: Class[],
    name?: string
  ): GeneralizationSet {
    const generalizations = specifics.map(s => s.addParent(general));
    return this.createGeneralizationSet(generalizations, true, true, name);
  }

  createGeneralizationSetFromClasses(
    general: Class,
    specifics: Class[],
    isDisjoint: boolean = false,
    isComplete: boolean = false,
    name?: string
  ): GeneralizationSet {
    const generalizations = specifics.map(s => s.addParent(general));
    return this.createGeneralizationSet(
      generalizations,
      isDisjoint,
      isComplete,
      name
    );
  }

  /**
   * Clones the model element and all its contents. Replaces all references to
   * original contents with references to their clones if
   * `replaceReferences = true`. If `replaceReferences = false`, replace() will
   * not be triggered, but this argument should only be used in recursive calls.
   *
   * @param replaceReferences - set to false on recursive calls to avoid
   * unnecessary call to `replace()`.
   *  */
  clone(replaceReferences: boolean = true): Package {
    const clone = { ...this };

    if (clone.getContents()) {
      const clonedContents = clone
        .getContents()
        .map(c => (c instanceof Package ? c.clone(false) : c.clone()));

      this.contents = clonedContents as PackageableElement[];
    }

    if (replaceReferences) {
      Package.triggersReplaceOnClonedPackage(this, clone);
    }

    return clone;
  }

  replace(originalElement: ModelElement, newElement: ModelElement): void {
    if (this.container === originalElement) {
      this.container = newElement as Package;
    }

    this.getContents().forEach(content =>
      content.replace(originalElement, newElement)
    );
  }

  /** Triggers `replace()` on `clonedPackage` and all of its contents, removing
   * references to the contents of `originalPackage` with their references to
   * their clones. */
  static triggersReplaceOnClonedPackage(
    originalPackage: Package,
    clonedPackage: Package
  ): void {
    const replacementsMap = new Map<any, any>();

    replacementsMap.set(originalPackage.id, {
      originalContent: originalPackage,
      newContent: clonedPackage
    });

    originalPackage.getAllContents().forEach(content =>
      replacementsMap.set(content.id, {
        originalContent: content,
        newContent: null
      })
    );

    clonedPackage.getAllContents().forEach(content => {
      const id = content.id;
      const entry = { ...replacementsMap.get(id), newContent: content };
      replacementsMap.set(id, entry);
    });

    clonedPackage
      .getContents()
      .forEach(content =>
        replacementsMap.forEach(({ originalContent, newContent }) =>
          content.replace(originalContent, newContent!)
        )
      );
  }
}
