import { remove } from 'lodash';
import {
  OntoumlType,
  Class,
  Generalization,
  GeneralizationSet,
  Relation,
  Classifier,
  Project,
  BinaryRelation,
  NaryRelation,
  ModelElement,
  Anchor,
  Note,
  ClassBuilder,
  GeneralizationBuilder,
  GeneralizationSetBuilder,
  PackageBuilder,
  Property,
  Literal,
  BinaryRelationBuilder,
  NaryRelationBuilder,
  NoteBuilder,
  AnchorBuilder,
  OntoumlElement
} from '..';

/** The union of the model element types that a {@link Package} can contain. */
export type PackageableElement =
  | Classifier<any, any>
  | Generalization
  | GeneralizationSet
  | Package
  | Anchor
  | Note;

/**
 * A container used to group model elements — classes, relations,
 * generalizations, generalization sets, notes, anchors, and other packages
 * — into modules, supporting the hierarchical organization of a model. For
 * example, a `Payment` package may group the classes and relations
 * describing payments.
 */
export class Package extends ModelElement {
  private _contents: PackageableElement[] = [];

  constructor(project: Project) {
    super(project);
  }

  /** The model elements directly contained in this package. */
  override get contents(): PackageableElement[] {
    return [...this._contents];
  }

  /**
   * Sets the model elements directly contained in this package, detaching
   * any previous contents.
   */
  override set contents(contents: PackageableElement[]) {
    this._contents.forEach(c => (c._container = undefined));
    this._contents = [];
    this.addContents(contents);
  }

  /** The package that contains this package, if any. */
  public override get container(): Package | undefined {
    return this._container as Package;
  }

  override getContents(): OntoumlElement[] {
    return this.contents;
  }

  /** The classes directly contained in this package. */
  public get classes(): Class[] {
    return this._contents.filter(e => e instanceof Class) as Class[];
  }

  /** The relations directly contained in this package. */
  public get relations(): Relation[] {
    return this._contents.filter(e => e instanceof Relation) as Relation[];
  }

  /** The binary relations directly contained in this package. */
  public get binaryRelations(): BinaryRelation[] {
    return this.relations.filter(
      e => e instanceof BinaryRelation
    ) as BinaryRelation[];
  }

  /** The n-ary relations directly contained in this package. */
  public get naryRelations(): NaryRelation[] {
    return this.relations.filter(
      e => e instanceof NaryRelation
    ) as NaryRelation[];
  }

  /** The generalizations directly contained in this package. */
  public get generalizations(): Generalization[] {
    return this._contents.filter(
      e => e instanceof Generalization
    ) as Generalization[];
  }

  /** The generalization sets directly contained in this package. */
  public get generalizationSets(): GeneralizationSet[] {
    return this._contents.filter(
      e => e instanceof GeneralizationSet
    ) as GeneralizationSet[];
  }

  /** The packages directly contained in this package. */
  public get packages(): Package[] {
    return this._contents.filter(e => e instanceof Package) as Package[];
  }

  /** The notes directly contained in this package. */
  public get notes(): Note[] {
    return this._contents.filter(e => e instanceof Note) as Note[];
  }

  /** The anchors directly contained in this package. */
  public get anchors(): Anchor[] {
    return this._contents.filter(e => e instanceof Anchor) as Anchor[];
  }

  /**
   * Retrieves the classes contained in this package or in any of its
   * subpackages.
   */
  public getAllClasses(): Class[] {
    return this.getAllContents().filter(e => e instanceof Class) as Class[];
  }

  /**
   * Retrieves the relations contained in this package or in any of its
   * subpackages.
   */
  public getAllRelations(): Relation[] {
    return this.getAllContents().filter(
      e => e instanceof Relation
    ) as Relation[];
  }

  /**
   * Retrieves the binary relations contained in this package or in any of
   * its subpackages.
   */
  public getAllBinaryRelations(): BinaryRelation[] {
    return this.getAllRelations().filter(
      e => e instanceof BinaryRelation
    ) as BinaryRelation[];
  }

  /**
   * Retrieves the n-ary relations contained in this package or in any of
   * its subpackages.
   */
  public getAllNaryRelations(): NaryRelation[] {
    return this.getAllRelations().filter(
      e => e instanceof NaryRelation
    ) as NaryRelation[];
  }

  /**
   * Retrieves the generalizations contained in this package or in any of
   * its subpackages.
   */
  public getAllGeneralizations(): Generalization[] {
    return this.getAllContents().filter(
      e => e instanceof Generalization
    ) as Generalization[];
  }

  /**
   * Retrieves the generalization sets contained in this package or in any
   * of its subpackages.
   */
  public getAllGeneralizationSets(): GeneralizationSet[] {
    return this.getAllContents().filter(
      e => e instanceof GeneralizationSet
    ) as GeneralizationSet[];
  }

  /**
   * Retrieves the packages contained in this package or in any of its
   * subpackages.
   */
  public getAllPackages(): Package[] {
    return this.getAllContents().filter(e => e instanceof Package) as Package[];
  }

  /**
   * Retrieves the notes contained in this package or in any of its
   * subpackages.
   */
  public getAllNotes(): Note[] {
    return this.getAllContents().filter(e => e instanceof Note) as Note[];
  }

  /**
   * Retrieves the anchors contained in this package or in any of its
   * subpackages.
   */
  public getAllAnchors(): Anchor[] {
    return this.getAllContents().filter(e => e instanceof Anchor) as Anchor[];
  }

  /**
   * Retrieves the properties (attributes and relation ends) of the
   * classifiers contained in this package or in any of its subpackages.
   */
  public getAllProperties(): Property[] {
    return this.getAllContents().filter(
      e => e instanceof Property
    ) as Property[];
  }

  /**
   * Retrieves the attributes of the classes contained in this package or in
   * any of its subpackages.
   */
  public getAllAttributes(): Property[] {
    return this.getAllProperties().filter(p => p.isAttribute());
  }

  /**
   * Retrieves the relation ends of the relations contained in this package
   * or in any of its subpackages.
   */
  public getAllRelationEnds(): Property[] {
    return this.getAllProperties().filter(p => p.isRelationEnd());
  }

  /**
   * Retrieves the literals of the enumerations contained in this package or
   * in any of its subpackages.
   */
  public getAllLiterals(): Literal[] {
    return this.getAllContents().filter(e => e instanceof Literal) as Literal[];
  }

  /**
   * Adds a model element to this package, removing it from its previous
   * package, if any.
   *
   * @returns the added element.
   * @throws an error if the element is null.
   */
  addContent<T extends PackageableElement>(child: T): T {
    if (child == null) {
      throw new Error('Cannot add null child.');
    }

    if (child.container instanceof Package) {
      child.container.removeContent(child);
    }

    child._container = this;
    this._contents.push(child);
    return child;
  }

  /**
   * Adds multiple model elements to this package, removing each from its
   * previous package, if any.
   *
   * @returns the added elements.
   * @throws an error if the array is null.
   */
  addContents<T extends PackageableElement>(contents: T[]): T[] {
    if (!contents) {
      throw new Error('Cannot add null array.');
    }

    return contents.map(x => this.addContent(x));
  }

  /**
   * Removes a model element from this package, clearing the element's
   * container.
   *
   * @returns `true` if the element was contained in the package.
   */
  removeContent<T extends PackageableElement>(child: T): boolean {
    let removed = remove(this._contents, x => child === x);

    if (removed.length > 0) {
      child._container = undefined;
    }

    return removed.length > 0;
  }

  /**
   * Deletes every model element contained in this package, recursively, in
   * addition to the dependents deleted for every model element (anchors
   * and views).
   */
  protected override deleteDependents(): void {
    this.contents.forEach(c => c.delete());
    super.deleteDependents();
  }

  /**
   * Clears the project's root package field when this package is the root,
   * in addition to the reference clean-up performed for every model
   * element.
   */
  protected override removeReferences(): void {
    if (this.project.root === this) {
      this.project.root = undefined;
    }

    super.removeReferences();
  }

  override toJSON(): any {
    const object = {
      type: OntoumlType.PACKAGE,
      contents: this._contents.map(e => e.id)
    };

    return { ...super.toJSON(), ...object };
  }

  /** Creates a builder for a {@link Class} contained in this package. */
  classBuilder(): ClassBuilder {
    return new ClassBuilder(this.project!).container(this);
  }

  /**
   * Creates a builder for a {@link Generalization} contained in this
   * package.
   */
  generalizationBuilder(): GeneralizationBuilder {
    return new GeneralizationBuilder(this.project!).container(this);
  }

  /**
   * Creates a builder for a {@link GeneralizationSet} contained in this
   * package.
   */
  generalizationSetBuilder(): GeneralizationSetBuilder {
    return new GeneralizationSetBuilder(this.project!).container(this);
  }

  /** Creates a builder for a {@link Package} contained in this package. */
  packageBuilder(): PackageBuilder {
    return new PackageBuilder(this.project!).container(this);
  }

  /**
   * Creates a builder for a {@link BinaryRelation} contained in this
   * package.
   */
  binaryRelationBuilder(): BinaryRelationBuilder {
    return new BinaryRelationBuilder(this.project!).container(this);
  }

  /**
   * Creates a builder for a {@link NaryRelation} contained in this package.
   */
  naryRelationBuilder(): NaryRelationBuilder {
    return new NaryRelationBuilder(this.project!).container(this);
  }

  /** Creates a builder for a {@link Note} contained in this package. */
  noteBuilder(): NoteBuilder {
    return new NoteBuilder(this.project!).container(this);
  }

  /** Creates a builder for an {@link Anchor} contained in this package. */
  anchorBuilder(): AnchorBuilder {
    return new AnchorBuilder(this.project!).container(this);
  }
}
