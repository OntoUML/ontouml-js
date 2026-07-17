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
  NaryRelationBuilder,
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
  private _linkViews: { [key: string]: LinkView } = {};

  license?: string;
  namespace?: string;
  publisher?: string;
  representationStyle?: string;
  private _accessRights: Set<string> = new Set();
  private _acronyms: Set<string> = new Set();
  private _bibliographicCitations: Set<string> = new Set();
  private _contexts: Set<string> = new Set();
  private _designedForTasks: Set<string> = new Set();
  private _keywords: Set<string> = new Set();
  private _landingPages: Set<string> = new Set();
  private _languages: Set<string> = new Set();
  private _ontologyTypes: Set<string> = new Set();
  private _sources: Set<string> = new Set();
  private _themes: Set<string> = new Set();

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

  get links(): Link[] {
    return Object.values(this._links);
  }

  link(id: string): Link | undefined {
    return this._links[id];
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
      this.link(id)
    );
  }

  get designedForTasks(): string[] {
    return [...this._designedForTasks];
  }

  set designedForTasks(array: string[]) {
    utils.assertArray(array);
    this._designedForTasks = new Set(array);
  }

  addDesignedForTask(value: string) {
    utils.assertValue(value);
    this._designedForTasks.add(value);
  }

  removeDesignedForTask(value: string) {
    this._designedForTasks.delete(value);
  }

  get accessRights(): string[] {
    return [...this._accessRights];
  }

  set accessRights(array: string[]) {
    utils.assertArray(array);
    this._accessRights = new Set(array);
  }

  addAccessRights(value: string) {
    utils.assertValue(value);
    this._accessRights.add(value);
  }

  remove(value: string) {
    this._accessRights.delete(value);
  }

  get themes(): string[] {
    return [...this._themes];
  }

  set themes(array: string[]) {
    utils.assertArray(array);
    this._themes = new Set(array);
  }

  addTheme(value: string) {
    utils.assertValue(value);
    this._themes.add(value);
  }

  removeTheme(value: string) {
    this._themes.delete(value);
  }

  get contexts(): string[] {
    return [...this._contexts];
  }

  set contexts(array: string[]) {
    utils.assertArray(array);
    this._contexts = new Set(array);
  }

  addContext(value: string) {
    utils.assertValue(value);
    this._contexts.add(value);
  }

  removeContext(value: string) {
    this._contexts.delete(value);
  }

  get ontologyTypes(): string[] {
    return [...this._ontologyTypes];
  }

  set ontologyTypes(array: string[]) {
    utils.assertArray(array);
    this._ontologyTypes = new Set(array);
  }

  addOntologyType(value: string) {
    utils.assertValue(value);
    this._ontologyTypes.add(value);
  }

  removeOntologyType(value: string) {
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

  get bibliographicCitations(): string[] {
    return [...this._bibliographicCitations];
  }

  set bibliographicCitations(array: string[]) {
    utils.assertArray(array);
    this._bibliographicCitations = new Set(array);
  }

  addBibliographiCitation(value: string) {
    utils.assertValue(value);
    this._bibliographicCitations.add(value);
  }

  removeBibliographicCitation(value: string) {
    this._bibliographicCitations.delete(value);
  }

  get keywords(): string[] {
    return [...this._keywords];
  }

  set keywords(array: string[]) {
    utils.assertArray(array);
    this._keywords = new Set(array);
  }

  addKeyword(value: string) {
    utils.assertValue(value);
    this._keywords.add(value);
  }

  removeKeyword(value: string) {
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
      ...Object.values(this._links),
      ...Object.values(this._diagrams),
      ...Object.values(this._classViews),
      ...Object.values(this._binaryRelationViews),
      ...Object.values(this._nAryRelationViews),
      ...Object.values(this._generalizationViews),
      ...Object.values(this._generalizationSetViews),
      ...Object.values(this._packageViews),
      ...Object.values(this._noteViews),
      ...Object.values(this._linkViews)
    ];
  }

  private arrayToJSON(array: OntoumlElement[]): object {
    return array
      .map(e => e.toJSON())
      .reduce((json, e: OntoumlElement) => (json = { ...json, [e.id]: e }));
  }

  override toJSON(): any {
    return {
      type: OntoumlType.PROJECT,
      ...super.toJSON(),
      license: this.license || null,
      namespace: this.namespace || null,
      publisher: this.publisher || null,
      representationStyle: this.representationStyle || null,
      accessRights: this.accessRights,
      acronyms: this.acronyms,
      bibliographicCitations: this.bibliographicCitations,
      contexts: this.contexts,
      designedForTasks: this.designedForTasks,
      keywords: this.keywords,
      landingPages: this.landingPages,
      languages: this.languages,
      ontologyTypes: this.ontologyTypes,
      sources: this.sources,
      themes: this.themes,
      root: this.root || null,
      elements: {
        ...this.arrayToJSON(this.classes)
        // ...this._binaryRelations,
        // ...this._naryRelations,
        // ...this._generalizations,
        // ...this._generalizationSets,
        // ...this._packages,
        // ...this._notes,
        // ...this._links,
        // ...this._diagrams,
        // ...this._classViews,
        // ...this._binaryRelationViews,
        // ...this._nAryRelationViews,
        // ...this._generalizationViews,
        // ...this._generalizationSetViews,
        // ...this._packageViews,
        // ...this._noteViews,
        // ...this._linkViews
      }
    };
  }

  // No reference fields to resolve/replace
  resolveReferences(_elementReferenceMap: Map<string, OntoumlElement>): void {}
}
