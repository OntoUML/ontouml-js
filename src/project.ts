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
  Anchor,
  PackageView,
  NoteView,
  NaryRelationView,
  AnchorView,
  ClassBuilder,
  GeneralizationBuilder,
  BinaryRelation,
  NaryRelation,
  GeneralizationSetBuilder,
  Relation,
  PackageBuilder,
  BinaryRelationBuilder,
  NaryRelationBuilder,
  NoteBuilder,
  AnchorBuilder,
  ProjectBuilder,
  MultilingualText,
  Resource,
  utils
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
  private _anchors: { [key: string]: Anchor } = {};
  private _diagrams: { [key: string]: Diagram } = {};
  private _classViews: { [key: string]: ClassView } = {};
  private _binaryRelationViews: { [key: string]: BinaryRelationView } = {};
  private _nAryRelationViews: { [key: string]: NaryRelationView } = {};
  private _generalizationViews: { [key: string]: GeneralizationView } = {};
  private _generalizationSetViews: { [key: string]: GeneralizationSetView } =
    {};
  private _packageViews: { [key: string]: PackageView } = {};
  private _noteViews: { [key: string]: NoteView } = {};
  private _anchorViews: { [key: string]: AnchorView } = {};

  license?: Resource;
  namespace?: string;
  publisher?: Resource;
  representationStyle?: Resource;
  private _accessRights: Set<Resource> = new Set();
  private _acronyms: Set<string> = new Set();
  private _bibliographicCitations: Set<MultilingualText> = new Set();
  private _contexts: Set<Resource> = new Set();
  private _designedForTasks: Set<Resource> = new Set();
  private _keywords: Set<MultilingualText> = new Set();
  private _landingPages: Set<string> = new Set();
  private _languages: Set<string> = new Set();
  private _ontologyTypes: Set<Resource> = new Set();
  private _sources: Set<string> = new Set();
  private _themes: Set<Resource> = new Set();

  constructor() {
    super();

    this.finder = new Finder(this);
  }

  get classes(): Class[] {
    return Object.values(this._classes);
  }

  class(id: string): Class | undefined {
    return this._classes[id];
  }

  get relations(): Relation[] {
    return [...this.binaryRelations, ...this.naryRelations];
  }

  get binaryRelations(): BinaryRelation[] {
    return Object.values(this._binaryRelations);
  }

  binaryRelation(id: string): BinaryRelation | undefined {
    return this._binaryRelations[id];
  }

  get naryRelations(): NaryRelation[] {
    return Object.values(this._naryRelations);
  }

  naryRelation(id: string): NaryRelation | undefined {
    return this._naryRelations[id];
  }

  get generalizations(): Generalization[] {
    return Object.values(this._generalizations);
  }

  generalization(id: string): Generalization | undefined {
    return this._generalizations[id];
  }

  get generalizationSets(): GeneralizationSet[] {
    return Object.values(this._generalizationSets);
  }

  generalizationSet(id: string): GeneralizationSet | undefined {
    return this._generalizationSets[id];
  }

  get packages(): Package[] {
    return Object.values(this._packages);
  }

  package(id: string): Package | undefined {
    return this._packages[id];
  }

  get properties(): Property[] {
    return Object.values(this._properties);
  }

  property(id: string): Property | undefined {
    return this._properties[id];
  }

  get attributes(): Property[] {
    return Object.values(this._properties).filter(p => p.isAttribute());
  }

  get relationEnds(): Property[] {
    return Object.values(this._properties).filter(p => p.isRelationEnd());
  }

  get literals(): Literal[] {
    return Object.values(this._literals);
  }

  literal(id: string): Literal | undefined {
    return this._literals[id];
  }

  get notes(): Note[] {
    return Object.values(this._notes);
  }

  note(id: string): Note | undefined {
    return this._notes[id];
  }

  get anchors(): Anchor[] {
    return Object.values(this._anchors);
  }

  anchor(id: string): Anchor | undefined {
    return this._anchors[id];
  }

  get diagrams(): Diagram[] {
    return Object.values(this._diagrams);
  }

  diagram(id: string): Diagram | undefined {
    return this._diagrams[id];
  }

  element(id: string): OntoumlElement | undefined {
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
      this.anchor(id)
    );
  }

  get designedForTasks(): Resource[] {
    return [...this._designedForTasks];
  }

  set designedForTasks(array: Resource[]) {
    utils.assertArray(array);
    this._designedForTasks = new Set(array);
  }

  addDesignedForTask(value: Resource) {
    utils.assertValue(value);
    this._designedForTasks.add(value);
  }

  removeDesignedForTask(value: Resource) {
    this._designedForTasks.delete(value);
  }

  get accessRights(): Resource[] {
    return [...this._accessRights];
  }

  set accessRights(array: Resource[]) {
    utils.assertArray(array);
    this._accessRights = new Set(array);
  }

  addAccessRights(value: Resource) {
    utils.assertValue(value);
    this._accessRights.add(value);
  }

  removeAccessRights(value: Resource) {
    this._accessRights.delete(value);
  }

  get themes(): Resource[] {
    return [...this._themes];
  }

  set themes(array: Resource[]) {
    utils.assertArray(array);
    this._themes = new Set(array);
  }

  addTheme(value: Resource) {
    utils.assertValue(value);
    this._themes.add(value);
  }

  removeTheme(value: Resource) {
    this._themes.delete(value);
  }

  get contexts(): Resource[] {
    return [...this._contexts];
  }

  set contexts(array: Resource[]) {
    utils.assertArray(array);
    this._contexts = new Set(array);
  }

  addContext(value: Resource) {
    utils.assertValue(value);
    this._contexts.add(value);
  }

  removeContext(value: Resource) {
    this._contexts.delete(value);
  }

  get ontologyTypes(): Resource[] {
    return [...this._ontologyTypes];
  }

  set ontologyTypes(array: Resource[]) {
    utils.assertArray(array);
    this._ontologyTypes = new Set(array);
  }

  addOntologyType(value: Resource) {
    utils.assertValue(value);
    this._ontologyTypes.add(value);
  }

  removeOntologyType(value: Resource) {
    this._ontologyTypes.delete(value);
  }

  get landingPages(): string[] {
    return [...this._landingPages];
  }

  set landingPages(array: string[]) {
    utils.assertArray(array);
    this._landingPages = new Set(array);
  }

  addLandingPage(value: string) {
    utils.assertValue(value);
    this._landingPages.add(value);
  }

  removeLandingPage(value: string) {
    this._landingPages.delete(value);
  }

  get sources(): string[] {
    return [...this._sources];
  }

  set sources(array: string[]) {
    utils.assertArray(array);
    this._sources = new Set(array);
  }

  addSource(value: string) {
    utils.assertValue(value);
    this._sources.add(value);
  }

  removeSource(value: string) {
    this._sources.delete(value);
  }

  get bibliographicCitations(): MultilingualText[] {
    return [...this._bibliographicCitations];
  }

  set bibliographicCitations(array: MultilingualText[]) {
    utils.assertArray(array);
    this._bibliographicCitations = new Set(array);
  }

  addBibliographicCitation(value: MultilingualText) {
    utils.assertValue(value);
    this._bibliographicCitations.add(value);
  }

  removeBibliographicCitation(value: MultilingualText) {
    this._bibliographicCitations.delete(value);
  }

  get keywords(): MultilingualText[] {
    return [...this._keywords];
  }

  set keywords(array: MultilingualText[]) {
    utils.assertArray(array);
    this._keywords = new Set(array);
  }

  addKeyword(value: MultilingualText) {
    utils.assertValue(value);
    this._keywords.add(value);
  }

  removeKeyword(value: MultilingualText) {
    this._keywords.delete(value);
  }

  get acronyms(): string[] {
    return [...this._acronyms];
  }

  set acronyms(array: string[]) {
    utils.assertArray(array);
    this._acronyms = new Set(array);
  }

  addAcronym(value: string) {
    utils.assertValue(value);
    this._acronyms.add(value);
  }

  removeAcronym(value: string) {
    this._acronyms.delete(value);
  }

  get languages(): string[] {
    return [...this._languages];
  }

  set languages(array: string[]) {
    utils.assertArray(array);
    this._languages = new Set(array);
  }

  addLanguage(value: string) {
    utils.assertValue(value);
    this._languages.add(value);
  }

  removeLanguage(value: string) {
    this._languages.delete(value);
  }

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

  noteBuilder(): NoteBuilder {
    return new NoteBuilder(this);
  }

  anchorBuilder(): AnchorBuilder {
    return new AnchorBuilder(this);
  }

  static builder(): ProjectBuilder {
    return new ProjectBuilder();
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
    } else if (e instanceof Anchor) {
      this._anchors[e.id] = e;
    } else if (e instanceof Diagram) {
      this._diagrams[e.id] = e;
    } else if (e instanceof ClassView) {
      this._classViews[e.id] = e;
    } else if (e instanceof BinaryRelationView) {
      this._binaryRelationViews[e.id] = e;
    } else if (e instanceof NaryRelationView) {
      this._nAryRelationViews[e.id] = e;
    } else if (e instanceof GeneralizationView) {
      this._generalizationViews[e.id] = e;
    } else if (e instanceof GeneralizationSetView) {
      this._generalizationSetViews[e.id] = e;
    } else if (e instanceof PackageView) {
      this._packageViews[e.id] = e;
    } else if (e instanceof NoteView) {
      this._noteViews[e.id] = e;
    } else if (e instanceof AnchorView) {
      this._anchorViews[e.id] = e;
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

  override getContents(): OntoumlElement[] {
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
      ...Object.values(this._anchors),
      ...Object.values(this._diagrams),
      ...Object.values(this._classViews),
      ...Object.values(this._binaryRelationViews),
      ...Object.values(this._nAryRelationViews),
      ...Object.values(this._generalizationViews),
      ...Object.values(this._generalizationSetViews),
      ...Object.values(this._packageViews),
      ...Object.values(this._noteViews),
      ...Object.values(this._anchorViews)
    ];
  }

  override toJSON(): any {
    return {
      type: OntoumlType.PROJECT,
      ...super.toJSON(),
      license: this.license?.toJSON() ?? null,
      namespace: this.namespace || null,
      publisher: this.publisher?.toJSON() ?? null,
      representationStyle: this.representationStyle?.toJSON() ?? null,
      accessRights: this.accessRights.map(r => r.toJSON()),
      acronyms: this.acronyms,
      bibliographicCitations: this.bibliographicCitations.map(t => t.toJSON()),
      contexts: this.contexts.map(r => r.toJSON()),
      designedForTasks: this.designedForTasks.map(r => r.toJSON()),
      keywords: this.keywords.map(t => t.toJSON()),
      landingPages: this.landingPages,
      languages: this.languages,
      ontologyTypes: this.ontologyTypes.map(r => r.toJSON()),
      sources: this.sources,
      themes: this.themes.map(r => r.toJSON()),
      root: this.root?.id ?? null,
      elements: this.getContents().map(e => e.toJSON())
    };
  }

  // No reference fields to resolve/replace
  resolveReferences(_elementReferenceMap: Map<string, OntoumlElement>): void {}
}
