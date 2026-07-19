import {
  Generalization,
  GeneralizationSet,
  Literal,
  Package,
  Property,
  OntoumlElement,
  OntoumlType,
  Diagram,
  View,
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

/**
 * An OntoUML project: the top-level container of an ontology and the entry
 * point of this library. A project holds every element of a model — classes,
 * relations, generalizations, packages, properties, notes — as well as the
 * diagrams and views that depict them, and provides typed access to these
 * elements by id or by kind.
 *
 * New elements are created through the fluent builders exposed by the
 * project (e.g., {@link classBuilder}, {@link binaryRelationBuilder}), which
 * register the created elements in the project.
 *
 * A project is also described by the metadata fields of the OntoUML/UFO
 * Catalog Metadata Vocabulary, such as publisher, license, keywords, themes,
 * and designed-for tasks.
 *
 * @example
 * ```typescript
 * const project = new Project();
 * const person = project.classBuilder().kind().name('Person').build();
 * const student = project.classBuilder().role().name('Student').build();
 *
 * project
 *   .generalizationBuilder()
 *   .general(person)
 *   .specific(student)
 *   .build();
 * ```
 */
export class Project extends NamedElement {
  /** A query helper that retrieves elements of this project by their
   * stereotypes and other classification criteria. */
  finder: Finder;

  /** The root package of the project, i.e., the package containing the whole
   * model, if any. */
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

  /** The license under which the project is distributed. */
  license?: Resource;

  /** The namespace URI under which the project's elements are identified. */
  namespace?: string;

  /** The agent responsible for making the project available, such as a
   * research group or a company. */
  publisher?: Resource;

  /** The modeling style adopted in the project, preferably one of the values
   * of {@link OntologyRepresentationStyle}. */
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

  /** The classes contained in this project. */
  get classes(): Class[] {
    return Object.values(this._classes);
  }

  /** Retrieves the class with the given id, if any. */
  class(id: string): Class | undefined {
    return this._classes[id];
  }

  /** The relations contained in this project, both binary and n-ary. */
  get relations(): Relation[] {
    return [...this.binaryRelations, ...this.naryRelations];
  }

  /** The binary relations contained in this project. */
  get binaryRelations(): BinaryRelation[] {
    return Object.values(this._binaryRelations);
  }

  /** Retrieves the binary relation with the given id, if any. */
  binaryRelation(id: string): BinaryRelation | undefined {
    return this._binaryRelations[id];
  }

  /** The n-ary relations contained in this project. */
  get naryRelations(): NaryRelation[] {
    return Object.values(this._naryRelations);
  }

  /** Retrieves the n-ary relation with the given id, if any. */
  naryRelation(id: string): NaryRelation | undefined {
    return this._naryRelations[id];
  }

  /** The generalizations contained in this project. */
  get generalizations(): Generalization[] {
    return Object.values(this._generalizations);
  }

  /** Retrieves the generalization with the given id, if any. */
  generalization(id: string): Generalization | undefined {
    return this._generalizations[id];
  }

  /** The generalization sets contained in this project. */
  get generalizationSets(): GeneralizationSet[] {
    return Object.values(this._generalizationSets);
  }

  /** Retrieves the generalization set with the given id, if any. */
  generalizationSet(id: string): GeneralizationSet | undefined {
    return this._generalizationSets[id];
  }

  /** The packages contained in this project. */
  get packages(): Package[] {
    return Object.values(this._packages);
  }

  /** Retrieves the package with the given id, if any. */
  package(id: string): Package | undefined {
    return this._packages[id];
  }

  /** The properties contained in this project, both attributes and relation
   * ends. */
  get properties(): Property[] {
    return Object.values(this._properties);
  }

  /** Retrieves the property with the given id, if any. */
  property(id: string): Property | undefined {
    return this._properties[id];
  }

  /** The properties contained in this project that are attributes of
   * classes. */
  get attributes(): Property[] {
    return Object.values(this._properties).filter(p => p.isAttribute());
  }

  /** The properties contained in this project that are ends of relations. */
  get relationEnds(): Property[] {
    return Object.values(this._properties).filter(p => p.isRelationEnd());
  }

  /** The literals of the enumerations contained in this project. */
  get literals(): Literal[] {
    return Object.values(this._literals);
  }

  /** Retrieves the literal with the given id, if any. */
  literal(id: string): Literal | undefined {
    return this._literals[id];
  }

  /** The notes contained in this project. */
  get notes(): Note[] {
    return Object.values(this._notes);
  }

  /** Retrieves the note with the given id, if any. */
  note(id: string): Note | undefined {
    return this._notes[id];
  }

  /** The anchors contained in this project, i.e., the links between notes
   * and the elements they annotate. */
  get anchors(): Anchor[] {
    return Object.values(this._anchors);
  }

  /** Retrieves the anchor with the given id, if any. */
  anchor(id: string): Anchor | undefined {
    return this._anchors[id];
  }

  /** The views contained in this project, across all of its diagrams. */
  get views(): View<any>[] {
    return [
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

  /** The diagrams contained in this project. */
  get diagrams(): Diagram[] {
    return Object.values(this._diagrams);
  }

  /** Retrieves the diagram with the given id, if any. */
  diagram(id: string): Diagram | undefined {
    return this._diagrams[id];
  }

  /**
   * Retrieves the model element with the given id, if any, searching across
   * classes, relations, generalizations, generalization sets, packages,
   * properties, literals, notes, and anchors.
   */
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

  /** The goals that motivated the development of this project, preferably
   * values of {@link OntologyPurpose}. */
  get designedForTasks(): Resource[] {
    return [...this._designedForTasks];
  }

  /**
   * Sets the goals that motivated the development of this project, replacing
   * any existing ones. Values should preferably be taken from
   * {@link OntologyPurpose}.
   *
   * @throws an error if the array is null, undefined, or contains a null or
   *         undefined member.
   */
  set designedForTasks(array: Resource[]) {
    utils.assertArray(array);
    this._designedForTasks = new Set(array);
  }

  /**
   * Adds a goal that motivated the development of this project, preferably a
   * value of {@link OntologyPurpose}.
   *
   * @throws an error if the value is null or undefined.
   */
  addDesignedForTask(value: Resource) {
    utils.assertValue(value);
    this._designedForTasks.add(value);
  }

  /** Removes a designed-for task from this project. */
  removeDesignedForTask(value: Resource) {
    this._designedForTasks.delete(value);
  }

  /** The access rights of this project, i.e., information about who can
   * access it or its security status. */
  get accessRights(): Resource[] {
    return [...this._accessRights];
  }

  /**
   * Sets the access rights of this project, replacing any existing ones.
   *
   * @throws an error if the array is null, undefined, or contains a null or
   *         undefined member.
   */
  set accessRights(array: Resource[]) {
    utils.assertArray(array);
    this._accessRights = new Set(array);
  }

  /**
   * Adds an access right to this project, i.e., information about who can
   * access it or its security status.
   *
   * @throws an error if the value is null or undefined.
   */
  addAccessRights(value: Resource) {
    utils.assertValue(value);
    this._accessRights.add(value);
  }

  /** Removes an access right from this project. */
  removeAccessRights(value: Resource) {
    this._accessRights.delete(value);
  }

  /** The central themes of this project, i.e., the subject domains it covers
   * (e.g., healthcare, finance). */
  get themes(): Resource[] {
    return [...this._themes];
  }

  /**
   * Sets the central themes of this project, replacing any existing ones.
   *
   * @throws an error if the array is null, undefined, or contains a null or
   *         undefined member.
   */
  set themes(array: Resource[]) {
    utils.assertArray(array);
    this._themes = new Set(array);
  }

  /**
   * Adds a central theme to this project, i.e., a subject domain it covers
   * (e.g., healthcare, finance).
   *
   * @throws an error if the value is null or undefined.
   */
  addTheme(value: Resource) {
    utils.assertValue(value);
    this._themes.add(value);
  }

  /** Removes a theme from this project. */
  removeTheme(value: Resource) {
    this._themes.delete(value);
  }

  /** The contexts in which this project was developed, preferably values of
   * {@link OntologyDevelopmentContext}. */
  get contexts(): Resource[] {
    return [...this._contexts];
  }

  /**
   * Sets the contexts in which this project was developed, replacing any
   * existing ones. Values should preferably be taken from
   * {@link OntologyDevelopmentContext}.
   *
   * @throws an error if the array is null, undefined, or contains a null or
   *         undefined member.
   */
  set contexts(array: Resource[]) {
    utils.assertArray(array);
    this._contexts = new Set(array);
  }

  /**
   * Adds a context in which this project was developed, preferably a value
   * of {@link OntologyDevelopmentContext}.
   *
   * @throws an error if the value is null or undefined.
   */
  addContext(value: Resource) {
    utils.assertValue(value);
    this._contexts.add(value);
  }

  /** Removes a context from this project. */
  removeContext(value: Resource) {
    this._contexts.delete(value);
  }

  /** The types classifying this project's ontology according to its
   * generality, preferably values of {@link OntologyType}. */
  get ontologyTypes(): Resource[] {
    return [...this._ontologyTypes];
  }

  /**
   * Sets the types classifying this project's ontology, replacing any
   * existing ones. Values should preferably be taken from
   * {@link OntologyType}.
   *
   * @throws an error if the array is null, undefined, or contains a null or
   *         undefined member.
   */
  set ontologyTypes(array: Resource[]) {
    utils.assertArray(array);
    this._ontologyTypes = new Set(array);
  }

  /**
   * Adds a type classifying this project's ontology according to its
   * generality, preferably a value of {@link OntologyType}.
   *
   * @throws an error if the value is null or undefined.
   */
  addOntologyType(value: Resource) {
    utils.assertValue(value);
    this._ontologyTypes.add(value);
  }

  /** Removes an ontology type from this project. */
  removeOntologyType(value: Resource) {
    this._ontologyTypes.delete(value);
  }

  /** The URLs of the web pages where this project is made available. */
  get landingPages(): string[] {
    return [...this._landingPages];
  }

  /**
   * Sets the landing pages of this project, replacing any existing ones.
   *
   * @throws an error if the array is null, undefined, or contains a null or
   *         undefined member.
   */
  set landingPages(array: string[]) {
    utils.assertArray(array);
    this._landingPages = new Set(array);
  }

  /**
   * Adds the URL of a web page where this project is made available.
   *
   * @throws an error if the value is null or undefined.
   */
  addLandingPage(value: string) {
    utils.assertValue(value);
    this._landingPages.add(value);
  }

  /** Removes a landing page from this project. */
  removeLandingPage(value: string) {
    this._landingPages.delete(value);
  }

  /** The URIs of the resources from which this project is derived, such as
   * other ontologies or standards. */
  get sources(): string[] {
    return [...this._sources];
  }

  /**
   * Sets the sources of this project, replacing any existing ones.
   *
   * @throws an error if the array is null, undefined, or contains a null or
   *         undefined member.
   */
  set sources(array: string[]) {
    utils.assertArray(array);
    this._sources = new Set(array);
  }

  /**
   * Adds the URI of a resource from which this project is derived, such as
   * another ontology or a standard.
   *
   * @throws an error if the value is null or undefined.
   */
  addSource(value: string) {
    utils.assertValue(value);
    this._sources.add(value);
  }

  /** Removes a source from this project. */
  removeSource(value: string) {
    this._sources.delete(value);
  }

  /** The bibliographic citations of the publications that document this
   * project. */
  get bibliographicCitations(): MultilingualText[] {
    return [...this._bibliographicCitations];
  }

  /**
   * Sets the bibliographic citations of this project, replacing any existing
   * ones.
   *
   * @throws an error if the array is null, undefined, or contains a null or
   *         undefined member.
   */
  set bibliographicCitations(array: MultilingualText[]) {
    utils.assertArray(array);
    this._bibliographicCitations = new Set(array);
  }

  /**
   * Adds a bibliographic citation to a publication that documents this
   * project.
   *
   * @throws an error if the value is null or undefined.
   */
  addBibliographicCitation(value: MultilingualText) {
    utils.assertValue(value);
    this._bibliographicCitations.add(value);
  }

  /** Removes a bibliographic citation from this project. */
  removeBibliographicCitation(value: MultilingualText) {
    this._bibliographicCitations.delete(value);
  }

  /** The keywords describing the content of this project. */
  get keywords(): MultilingualText[] {
    return [...this._keywords];
  }

  /**
   * Sets the keywords of this project, replacing any existing ones.
   *
   * @throws an error if the array is null, undefined, or contains a null or
   *         undefined member.
   */
  set keywords(array: MultilingualText[]) {
    utils.assertArray(array);
    this._keywords = new Set(array);
  }

  /**
   * Adds a keyword describing the content of this project.
   *
   * @throws an error if the value is null or undefined.
   */
  addKeyword(value: MultilingualText) {
    utils.assertValue(value);
    this._keywords.add(value);
  }

  /** Removes a keyword from this project. */
  removeKeyword(value: MultilingualText) {
    this._keywords.delete(value);
  }

  /** The acronyms by which this project is known (e.g., `"UFO-S"`). */
  get acronyms(): string[] {
    return [...this._acronyms];
  }

  /**
   * Sets the acronyms of this project, replacing any existing ones.
   *
   * @throws an error if the array is null, undefined, or contains a null or
   *         undefined member.
   */
  set acronyms(array: string[]) {
    utils.assertArray(array);
    this._acronyms = new Set(array);
  }

  /**
   * Adds an acronym by which this project is known (e.g., `"UFO-S"`).
   *
   * @throws an error if the value is null or undefined.
   */
  addAcronym(value: string) {
    utils.assertValue(value);
    this._acronyms.add(value);
  }

  /** Removes an acronym from this project. */
  removeAcronym(value: string) {
    this._acronyms.delete(value);
  }

  /** The languages in which this project's elements are written, identified
   * by language tags (e.g., `"en"`, `"pt"`). */
  get languages(): string[] {
    return [...this._languages];
  }

  /**
   * Sets the languages of this project, replacing any existing ones.
   *
   * @throws an error if the array is null, undefined, or contains a null or
   *         undefined member.
   */
  set languages(array: string[]) {
    utils.assertArray(array);
    this._languages = new Set(array);
  }

  /**
   * Adds a language in which this project's elements are written, identified
   * by a language tag (e.g., `"en"`, `"pt"`).
   *
   * @throws an error if the value is null or undefined.
   */
  addLanguage(value: string) {
    utils.assertValue(value);
    this._languages.add(value);
  }

  /** Removes a language from this project. */
  removeLanguage(value: string) {
    this._languages.delete(value);
  }

  /**
   * Creates a builder for a new {@link Class} in this project.
   */
  classBuilder(): ClassBuilder {
    return new ClassBuilder(this);
  }

  /**
   * Creates a builder for a new {@link Generalization} in this project.
   */
  generalizationBuilder(): GeneralizationBuilder {
    return new GeneralizationBuilder(this);
  }

  /**
   * Creates a builder for a new {@link GeneralizationSet} in this project.
   */
  generalizationSetBuilder(): GeneralizationSetBuilder {
    return new GeneralizationSetBuilder(this);
  }

  /**
   * Creates a builder for a new {@link Package} in this project.
   */
  packageBuilder(): PackageBuilder {
    return new PackageBuilder(this);
  }

  /**
   * Creates a builder for a new {@link BinaryRelation} in this project.
   */
  binaryRelationBuilder(): BinaryRelationBuilder {
    return new BinaryRelationBuilder(this);
  }

  /**
   * Creates a builder for a new {@link NaryRelation} in this project.
   */
  naryRelationBuilder(): NaryRelationBuilder {
    return new NaryRelationBuilder(this);
  }

  /**
   * Creates a builder for a new {@link Note} in this project.
   */
  noteBuilder(): NoteBuilder {
    return new NoteBuilder(this);
  }

  /**
   * Creates a builder for a new {@link Anchor} in this project.
   */
  anchorBuilder(): AnchorBuilder {
    return new AnchorBuilder(this);
  }

  /**
   * Creates a builder for a new {@link Project}.
   */
  static builder(): ProjectBuilder {
    return new ProjectBuilder();
  }

  /**
   * Registers an element in this project, indexing it by its id according to
   * its concrete type. Elements of unrecognized types are silently ignored.
   *
   * @throws an error if the element is null or undefined.
   */
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

  /**
   * Removes an element from this project's indexes: the inverse of
   * {@link add}. This method does not cascade — references to the element
   * held by other elements are left untouched. To delete an element and
   * clean up every reference to it, use the element's `delete()` method
   * instead.
   *
   * @returns `true` if the element was registered in the project and has
   *          been removed.
   * @throws an error if the element is null or undefined.
   */
  deregister(e: OntoumlElement): boolean {
    if (!e) {
      throw new Error('Cannot deregister a null or undefined element.');
    }

    const maps: { [key: string]: OntoumlElement }[] = [
      this._classes,
      this._binaryRelations,
      this._naryRelations,
      this._generalizations,
      this._generalizationSets,
      this._packages,
      this._properties,
      this._literals,
      this._notes,
      this._anchors,
      this._diagrams,
      this._classViews,
      this._binaryRelationViews,
      this._nAryRelationViews,
      this._generalizationViews,
      this._generalizationSetViews,
      this._packageViews,
      this._noteViews,
      this._anchorViews
    ];

    for (const map of maps) {
      // the element may be indexed under a stale key if its id was
      // reassigned after registration, so a lookup by id is not enough
      const key = Object.keys(map).find(k => map[k] === e);

      if (key !== undefined) {
        delete map[key];
        return true;
      }
    }

    return false;
  }

  /**
   * Creates a new {@link Diagram} and adds it to this project.
   */
  createDiagram(): Diagram {
    const diagram = new Diagram(this);
    this.addDiagram(diagram);
    return diagram;
  }

  /**
   * Adds a diagram to this project.
   *
   * @throws an error if the diagram is null.
   */
  addDiagram(diagram: Diagram) {
    if (diagram === null) {
      throw new Error('Cannot add a null diagram.');
    }

    this._diagrams[diagram.id] = diagram;
  }

  /**
   * Adds multiple diagrams to this project.
   *
   * @throws an error if the list is null or empty.
   */
  addDiagrams(diagrams: Diagram[]) {
    if (diagrams === null || diagrams.length == 0) {
      throw new Error('Cannot add a null or empty list of diagrams.');
    }

    diagrams.forEach(d => this.addDiagram(d));
  }

  /**
   * Sets the diagrams of this project, replacing any existing ones. An
   * empty array clears the project's diagrams. The views of the replaced
   * diagrams are left untouched; to delete diagrams along with their views,
   * use {@link removeAllDiagrams} or the diagram's `delete()` method.
   *
   * @throws an error if the array is null, undefined, or contains a null or
   *         undefined member.
   */
  setDiagrams(diagrams: Diagram[]) {
    utils.assertArray(diagrams);

    this._diagrams = {};
    diagrams.forEach(d => this.addDiagram(d));
  }

  /**
   * Deletes every diagram of this project, along with the views the
   * diagrams contain. The model elements depicted by the views are not
   * affected.
   */
  removeAllDiagrams(): void {
    this.diagrams.forEach(d => d.delete());
  }

  /**
   * Returns every element registered in this project: model elements,
   * diagrams, and views.
   */
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
}
