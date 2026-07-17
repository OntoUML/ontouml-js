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
  ProjectElement,
  OntoumlElement
} from '..';

export type PackageableElement =
  | Classifier<any, any>
  | Generalization
  | GeneralizationSet
  | Package
  | Anchor
  | Note;

export class Package extends ModelElement {
  private _contents: PackageableElement[] = [];

  constructor(project: Project) {
    super(project);
  }

  override get contents(): PackageableElement[] {
    return [...this._contents];
  }

  // TODO: Check this method
  override set contents(contents: PackageableElement[]) {
    this._contents = [];
    this.addContents(contents);
  }

  public override get container(): Package | undefined {
    return this._container as Package;
  }

  override getContents(): OntoumlElement[] {
    return this.contents;
  }

  public get classes(): Class[] {
    return this._contents.filter(e => e instanceof Class) as Class[];
  }

  public get relations(): Relation[] {
    return this._contents.filter(e => e instanceof Relation) as Relation[];
  }

  public get binaryRelations(): BinaryRelation[] {
    return this.relations.filter(
      e => e instanceof BinaryRelation
    ) as BinaryRelation[];
  }

  public get naryRelations(): NaryRelation[] {
    return this.relations.filter(
      e => e instanceof NaryRelation
    ) as NaryRelation[];
  }

  public get generalizations(): Generalization[] {
    return this._contents.filter(
      e => e instanceof Generalization
    ) as Generalization[];
  }

  public get generalizationSets(): GeneralizationSet[] {
    return this._contents.filter(
      e => e instanceof GeneralizationSet
    ) as GeneralizationSet[];
  }

  public get packages(): Package[] {
    return this._contents.filter(e => e instanceof Package) as Package[];
  }

  public get notes(): Note[] {
    return this._contents.filter(e => e instanceof Note) as Note[];
  }

  public get anchors(): Anchor[] {
    return this._contents.filter(e => e instanceof Anchor) as Anchor[];
  }

  public getAllClasses(): Class[] {
    return this.getAllContents().filter(e => e instanceof Class) as Class[];
  }

  public getAllRelations(): Relation[] {
    return this.getAllContents().filter(
      e => e instanceof Relation
    ) as Relation[];
  }

  public getAllBinaryRelations(): BinaryRelation[] {
    return this.getAllRelations().filter(
      e => e instanceof BinaryRelation
    ) as BinaryRelation[];
  }

  public getAllNaryRelations(): NaryRelation[] {
    return this.getAllRelations().filter(
      e => e instanceof NaryRelation
    ) as NaryRelation[];
  }

  public getAllGeneralizations(): Generalization[] {
    return this.getAllContents().filter(
      e => e instanceof Generalization
    ) as Generalization[];
  }

  public getAllGeneralizationSets(): GeneralizationSet[] {
    return this.getAllContents().filter(
      e => e instanceof GeneralizationSet
    ) as GeneralizationSet[];
  }

  public getAllPackages(): Package[] {
    return this.getAllContents().filter(e => e instanceof Package) as Package[];
  }

  public getAllNotes(): Note[] {
    return this.getAllContents().filter(e => e instanceof Note) as Note[];
  }

  public getAllAnchors(): Anchor[] {
    return this.getAllContents().filter(e => e instanceof Anchor) as Anchor[];
  }

  public getAllProperties(): Property[] {
    return this.getAllContents().filter(
      e => e instanceof Property
    ) as Property[];
  }

  public getAllAttributes(): Property[] {
    return this.getAllProperties().filter(p => p.isAttribute());
  }

  public getAllRelationEnds(): Property[] {
    return this.getAllProperties().filter(p => p.isRelationEnd());
  }

  public getAllLiterals(): Literal[] {
    return this.getAllContents().filter(e => e instanceof Literal) as Literal[];
  }

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

  addContents<T extends PackageableElement>(contents: T[]): T[] {
    if (!contents) {
      throw new Error('Cannot add null array.');
    }

    return contents.map(x => this.addContent(x));
  }

  removeContent<T extends PackageableElement>(child: T): boolean {
    const originalLength = this._contents.length;

    let removed = remove(this._contents, x => child === x);
    if (removed.length > 0) {
      child._container = undefined;
    }

    return originalLength > removed.length;
  }

  override toJSON(): any {
    const object = {
      type: OntoumlType.PACKAGE,
      contents: this._contents.map(e => e.id)
    };

    return { ...super.toJSON(), ...object };
  }

  classBuilder(): ClassBuilder {
    return new ClassBuilder(this.project!).container(this);
  }

  generalizationBuilder(): GeneralizationBuilder {
    return new GeneralizationBuilder(this.project!).container(this);
  }

  generalizationSetBuilder(): GeneralizationSetBuilder {
    return new GeneralizationSetBuilder(this.project!).container(this);
  }

  packageBuilder(): PackageBuilder {
    return new PackageBuilder(this.project!).container(this);
  }

  binaryRelationBuilder(): BinaryRelationBuilder {
    return new BinaryRelationBuilder(this.project!).container(this);
  }
}
