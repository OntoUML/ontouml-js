import {
  Generalization,
  GeneralizationSet,
  Literal,
  Package,
  Property,
  OntoumlElement,
  OntoumlType,
  Diagram,
  ClassView,
  BinaryRelationView,
  GeneralizationView,
  GeneralizationSetView,
  NamedElement,
  Finder,
  Class,
  Note,
  Link,
  PackageView,
  NoteView,
  NaryRelationView,
  LinkView,
  ClassBuilder,
  GeneralizationBuilder,
  BinaryRelation,
  NaryRelation,
  GeneralizationSetBuilder,
  Relation,
  PackageBuilder,
  BinaryRelationBuilder,
  NaryRelationBuilder
} from '.';

export class Project extends NamedElement {
  finder: Finder;
  root?: Package;

  private _classes: { [key: string]: Class } = {};
  private _binaryRelations: { [key: string]: BinaryRelation } = {};
  private _naryRelations: { [key: string]: NaryRelation } = {};
  private _generalizations: { [key: string]: Generalization } = {};
  private _generalizationSets: { [key: string]: GeneralizationSet } = {};
  private _packages: { [key: string]: Package } = {};
  private _properties: { [key: string]: Property } = {};
  private _literals: { [key: string]: Literal } = {};
  private _notes: { [key: string]: Note } = {};
  private _links: { [key: string]: Link } = {};
  private _diagrams: { [key: string]: Diagram } = {};
  private _classViews: { [key: string]: ClassView } = {};
  private _binaryRelationViews: { [key: string]: BinaryRelationView } = {};
  private _nAryRelationViews: { [key: string]: NaryRelationView } = {};
  private _generalizationViews: { [key: string]: GeneralizationView } = {};
  private _generalizationSetViews: { [key: string]: GeneralizationSetView } =
    {};
  private _packageViews: { [key: string]: PackageView } = {};
  private _noteViews: { [key: string]: NoteView } = {};
  private _noteLinkViews: { [key: string]: LinkView } = {};

  constructor() {
    super();

    this.finder = new Finder(this);
  }

  public get classes(): Class[] {
    return Object.values(this._classes);
  }

  public class(id: string): Class | undefined {
    return this._classes[id];
  }

  public get relations(): Relation[] {
    return [...this.binaryRelations, ...this.naryRelations];
  }

  public get binaryRelations(): BinaryRelation[] {
    return Object.values(this._binaryRelations);
  }

  public binaryRelation(id: string): BinaryRelation | undefined {
    return this._binaryRelations[id];
  }

  public get naryRelations(): NaryRelation[] {
    return Object.values(this._naryRelations);
  }

  public naryRelation(id: string): NaryRelation | undefined {
    return this._naryRelations[id];
  }

  public get generalizations(): Generalization[] {
    return Object.values(this._generalizations);
  }

  public generalization(id: string): Generalization | undefined {
    return this._generalizations[id];
  }

  public get generalizationSets(): GeneralizationSet[] {
    return Object.values(this._generalizationSets);
  }

  public generalizationSet(id: string): GeneralizationSet | undefined {
    return this._generalizationSets[id];
  }

  public get packages(): Package[] {
    return Object.values(this._packages);
  }

  public package(id: string): Package | undefined {
    return this._packages[id];
  }

  public get properties(): Property[] {
    return Object.values(this._properties);
  }

  public property(id: string): Property | undefined {
    return this._properties[id];
  }

  public get attributes(): Property[] {
    return Object.values(this._properties).filter(p => p.isAttribute());
  }

  public get relationEnds(): Property[] {
    return Object.values(this._properties).filter(p => p.isRelationEnd());
  }

  public get literals(): Literal[] {
    return Object.values(this._literals);
  }

  public literal(id: string): Literal | undefined {
    return this._literals[id];
  }

  public get notes(): Note[] {
    return Object.values(this._notes);
  }

  public note(id: string): Note | undefined {
    return this._notes[id];
  }

  public get links(): Link[] {
    return Object.values(this._links);
  }

  public link(id: string): Link | undefined {
    return this._links[id];
  }

  public element(id: string): OntoumlElement | undefined {
    return (
      this.class(id) ||
      this.binaryRelation(id) ||
      this.naryRelation(id) ||
      this.generalization(id) ||
      this.generalizationSet(id) ||
      this.package(id) ||
      this.property(id) ||
      this.literal(id) ||
      this.note(id) ||
      this.link(id)
    );
  }

  // createModel(base?: Partial<Package>): Package {
  //   if (this.model) {
  //     throw new Error('Model already defined');
  //   }

  //   // TODO: Should the container of the model be the project?
  //   this.model = new Package(base);
  //   this.setProject(this);

  //   return this.model;
  // }

  // setModel(pkg: Package): void {
  //   this.model = pkg;
  //   if (pkg != null) {
  //     this.model.setContainer(this);
  //   }
  // }

  classBuilder(): ClassBuilder {
    return new ClassBuilder(this);
  }

  generalizationBuilder(): GeneralizationBuilder {
    return new GeneralizationBuilder(this);
  }

  generalizationSetBuilder(): GeneralizationSetBuilder {
    return new GeneralizationSetBuilder(this);
  }

  packageBuilder(): PackageBuilder {
    return new PackageBuilder(this);
  }

  binaryRelationBuilder(): BinaryRelationBuilder {
    return new BinaryRelationBuilder(this);
  }

  naryRelationBuilder(): NaryRelationBuilder {
    return new NaryRelationBuilder(this);
  }

  add(e: OntoumlElement): void {
    if (!e) {
      throw new Error('Cannot add a null or undefined element.');
    }

    if (e instanceof Class) {
      this._classes[e.id] = e;
    } else if (e instanceof BinaryRelation) {
      this._binaryRelations[e.id] = e;
    } else if (e instanceof NaryRelation) {
      this._naryRelations[e.id] = e;
    } else if (e instanceof Generalization) {
      this._generalizations[e.id] = e;
    } else if (e instanceof GeneralizationSet) {
      this._generalizationSets[e.id] = e;
    } else if (e instanceof Package) {
      this._packages[e.id] = e;
    } else if (e instanceof Property) {
      this._properties[e.id] = e;
    } else if (e instanceof Literal) {
      this._literals[e.id] = e;
    } else if (e instanceof Note) {
      this._notes[e.id] = e;
    } else if (e instanceof Link) {
      this._links[e.id] = e;
    }
  }

  createDiagram(): Diagram {
    const diagram = new Diagram(this);
    this.addDiagram(diagram);
    return diagram;
  }

  addDiagram(diagram: Diagram) {
    if (diagram === null) {
      throw new Error('Cannot add a null diagram.');
    }

    this._diagrams[diagram.id] = diagram;
  }

  addDiagrams(diagrams: Diagram[]) {
    if (diagrams === null || diagrams.length == 0) {
      throw new Error('Cannot add a null or empty list of diagrams.');
    }

    diagrams.forEach(d => this.addDiagram(d));
  }

  setDiagrams(diagrams: Diagram[]) {
    this._diagrams = {};

    if (diagrams === null) return;

    this.addDiagrams(diagrams);
  }

  override getAllContents(): OntoumlElement[] {
    return this.getContents();
  }

  getContents(): OntoumlElement[] {
    return [
      ...Object.values(this._classes),
      ...Object.values(this._binaryRelations),
      ...Object.values(this._naryRelations),
      ...Object.values(this._generalizations),
      ...Object.values(this._generalizationSets),
      ...Object.values(this._packages),
      ...Object.values(this._properties),
      ...Object.values(this._literals),
      ...Object.values(this._notes),
      ...Object.values(this._links),
      ...Object.values(this._diagrams),
      ...Object.values(this._classViews),
      ...Object.values(this._binaryRelationViews),
      ...Object.values(this._nAryRelationViews),
      ...Object.values(this._generalizationViews),
      ...Object.values(this._generalizationSetViews),
      ...Object.values(this._packageViews),
      ...Object.values(this._noteViews),
      ...Object.values(this._noteLinkViews)
    ];
  }

  override toJSON(): any {
    const object = {
      type: OntoumlType.PROJECT,
      root: this.root || null,
      elements: null
    };

    return { ...object, ...super.toJSON() };
  }

  override toString(): string {
    return 'Hello';
  }

  // No reference fields to resolve/replace
  resolveReferences(_elementReferenceMap: Map<string, OntoumlElement>): void {}

  clone(): OntoumlElement {
    throw new Error('Method not implemented.');
  }

  replace(originalElement: OntoumlElement, newElement: OntoumlElement): void {
    throw new Error('Method not implemented.');
  }
}
