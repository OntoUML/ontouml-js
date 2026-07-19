import {
  ModelElement,
  OntoumlElement,
  OntoumlType,
  View,
  Class,
  Generalization,
  GeneralizationSet,
  Package,
  ClassView,
  GeneralizationSetView,
  GeneralizationView,
  PackageView,
  BinaryRelationView,
  Project,
  BinaryRelation,
  NaryRelation,
  Path,
  Rectangle,
  Shape,
  Text,
  NaryRelationView,
  ProjectElement,
  utils
} from '..';

/**
 * A diagrammatic representation of (part of) the model of a {@link Project},
 * following the OntoUML diagram interchange. A diagram aggregates
 * {@link View} instances, each pairing a {@link ModelElement} with the
 * {@link Shape} instances that render it on the canvas. The same model
 * element may be depicted in any number of diagrams.
 *
 * The `add*` methods create views (and their default shapes) for model
 * elements, transitively creating views for required related elements, e.g.,
 * adding a relation also adds views for the classes it connects when these
 * are not yet depicted.
 */
export class Diagram extends OntoumlElement implements ProjectElement {
  /** The model element to which the diagram is attached, if any. */
  owner?: ModelElement;

  private _project: Project;
  private _views: Set<View<any>> = new Set();

  constructor(project: Project) {
    super();

    utils.assertValue(project);
    this._project = project;
  }

  /** The views contained in the diagram. */
  public get views(): View<any>[] {
    return [...this._views];
  }

  /** Replaces the views contained in the diagram. */
  public set views(value: View<any>[]) {
    this._views = new Set(value);
  }

  /** The project that contains this diagram. */
  get project(): Project {
    return this._project;
  }

  /**
   * Sets the project that contains this diagram. Throws an error if the
   * value is `null` or `undefined`.
   */
  set project(value: Project) {
    utils.assertValue(value);
    this._project = value;
  }

  /**
   * Returns every element contained in the diagram: its views followed by
   * their shapes.
   */
  override getAllContents(): (View<any> | Shape)[] {
    const views = this.views;
    const shapes = views.flatMap(v => v.shapes);

    return [...views, ...shapes];
  }

  /** Returns the views directly contained in the diagram. */
  override getContents(): OntoumlElement[] {
    return this.views;
  }

  /** Returns the {@link ClassView} instances in the diagram. */
  getClassViews(): ClassView[] {
    return this.views.filter(view => view instanceof ClassView) as ClassView[];
  }

  /** Returns the {@link BinaryRelationView} instances in the diagram. */
  getRelationViews(): BinaryRelationView[] {
    return this.views.filter(
      view => view instanceof BinaryRelationView
    ) as BinaryRelationView[];
  }

  /** Returns the {@link GeneralizationView} instances in the diagram. */
  getGeneralizationViews(): GeneralizationView[] {
    return this.views.filter(
      view => view instanceof GeneralizationView
    ) as GeneralizationView[];
  }

  /** Returns the {@link GeneralizationSetView} instances in the diagram. */
  getGeneralizationSetViews(): GeneralizationSetView[] {
    return this.views.filter(
      view => view instanceof GeneralizationSetView
    ) as GeneralizationSetView[];
  }

  /** Returns the {@link PackageView} instances in the diagram. */
  getPackageViews(): PackageView[] {
    return this.views.filter(
      view => view instanceof PackageView
    ) as PackageView[];
  }

  /** Returns the model elements depicted by the diagram's views. */
  getRealizedModelElements(): ModelElement[] {
    return this.views.map(view => view.element);
  }

  /** Returns the shapes of all views in the diagram. */
  getShapes(): Shape[] {
    return this.views.flatMap(view => view.getContents()) || [];
  }

  /** Returns the {@link Rectangle} shapes in the diagram. */
  getRectangles(): Rectangle[] {
    return this.getShapes().filter(s => s instanceof Rectangle) as Rectangle[];
  }

  /** Returns the {@link Path} shapes in the diagram. */
  getPaths(): Path[] {
    return this.getShapes().filter(s => s instanceof Path) as Path[];
  }

  /** Returns the {@link Text} shapes in the diagram. */
  getTexts(): Text[] {
    return this.getShapes().filter(s => s instanceof Text) as Text[];
  }

  /**
   * Adds a view to the diagram and registers it in the containing project.
   * Does nothing when the view is `null` or `undefined`.
   */
  addView(element: View<any>): void {
    if (!element) {
      return;
    }

    this._views.add(element);
    this.project?.add(element);
  }

  /**
   * Removes a view from the diagram. This method does not cascade — use
   * the view's `delete()` method to also remove the view from the project
   * and delete the connector views attached to it.
   *
   * @returns `true` if the view was contained in the diagram.
   */
  removeView(view: View<any>): boolean {
    return this._views.delete(view);
  }

  /**
   * Deletes this diagram from its project, deleting every view it
   * contains. The model elements depicted by the diagram are not affected.
   *
   * Deleting a diagram that was already deleted has no effect.
   */
  delete(): void {
    if (!this.project.deregister(this)) {
      return;
    }

    this.views.forEach(v => v.delete());
  }

  /** Adds each of the given views to the diagram. */
  addElements(elements: View<any>[]): void {
    if (!elements) {
      return;
    }

    elements.forEach(e => this.addView(e));
  }

  /** Replaces the diagram's views with the given ones. */
  setElements(elements: View<any>[]): void {
    this.views = [];

    if (!elements) {
      return;
    }

    this.addElements(elements);
  }

  /**
   * Finds the view whose depicted model element has the given id.
   *
   * @param id - id of the model element (not of the view).
   */
  findElementById(id: string): View<any> | undefined {
    return this.views.find(view => view.element.id === id);
  }

  /** Finds the view depicting the given model element, if any. */
  findView(modelElement: ModelElement): View<any> | undefined {
    return this.views.find(view => view.element === modelElement);
  }

  /**
   * Checks whether the diagram contains a view depicting the given model
   * element.
   */
  containsView(modelElement: ModelElement): boolean {
    return !!this.findView(modelElement);
  }

  /**
   * Creates and adds a view for each of the given model elements, skipping
   * `null` entries. Throws an error if the array itself is `null` or
   * `undefined`.
   *
   * @returns the created views, in the order of the input elements.
   */
  addModelElements(modelElements: ModelElement[]): View<any>[] | undefined {
    if (!modelElements) {
      throw new Error('Invalid parameter. `modelElements` cannot be null');
    }

    return modelElements
      .filter(e => e !== null)
      .map(e => this.addModelElement(e));
  }

  /**
   * Creates and adds a view suited to the type of the given model element,
   * delegating to {@link addClass}, {@link addBinaryRelation},
   * {@link addNaryRelation}, {@link addGeneralization},
   * {@link addGeneralizationSet}, or {@link addPackage}. Throws an error if
   * the element cannot be visualized in a diagram.
   */
  addModelElement(modelElement: ModelElement): View<any> {
    if (!modelElement)
      throw new Error(
        'Invalid parameter. The supplied element cannot be null.'
      );

    if (modelElement instanceof Class) return this.addClass(modelElement);
    if (modelElement instanceof BinaryRelation && modelElement.isBinary())
      return this.addBinaryRelation(modelElement);
    if (modelElement instanceof NaryRelation && modelElement.isNary())
      return this.addNaryRelation(modelElement);
    if (modelElement instanceof Generalization)
      return this.addGeneralization(modelElement);
    if (modelElement instanceof GeneralizationSet)
      return this.addGeneralizationSet(modelElement);
    if (modelElement instanceof Package) return this.addPackage(modelElement);

    throw new Error(
      'Invalid parameter. The supplied element cannot be visualized in a diagram. `modelElement`: ' +
        modelElement
    );
  }

  /**
   * Returns the existing view depicting the given model element or, when the
   * element is not yet depicted, creates and adds one via
   * {@link addModelElement}.
   */
  findOrCreateView(modelElement: ModelElement): View<any> {
    if (!modelElement)
      throw new Error(
        'Failed to get or add view. Input element is null or undefined.'
      );
    return this.findView(modelElement) || this.addModelElement(modelElement);
  }

  /**
   * Creates a {@link ClassView} for the given class and adds it to the
   * diagram.
   */
  addClass(clazz: Class): ClassView {
    let view = new ClassView(clazz);
    this.addView(view);
    return view;
  }

  /**
   * Creates a {@link GeneralizationSetView} for the given generalization set
   * and adds it to the diagram.
   */
  addGeneralizationSet(gs: GeneralizationSet): GeneralizationSetView {
    let view = new GeneralizationSetView(gs);
    this.addView(view);
    return view;
  }

  /**
   * Creates a {@link PackageView} for the given package and adds it to the
   * diagram.
   */
  addPackage(pkg: Package): PackageView {
    let view = new PackageView(pkg);
    this.addView(view);
    return view;
  }

  /**
   * Creates a {@link BinaryRelationView} for the given relation and adds it
   * to the diagram, creating views for the relation's source and target
   * classifiers when these are not yet depicted. Throws an error if either
   * end of the relation is untyped.
   */
  addBinaryRelation(rel: BinaryRelation): BinaryRelationView {
    rel.assertTypedSource();
    let sourceView = this.findOrCreateView(rel.source!);

    rel.assertTypedTarget();
    let targetView = this.findOrCreateView(rel.target!);

    let relationView = new BinaryRelationView(rel, sourceView, targetView);

    this.addView(relationView);
    return relationView;
  }

  /**
   * Creates a {@link NaryRelationView} for the given relation and adds it to
   * the diagram, creating views for the relation's member classes when these
   * are not yet depicted. Throws an error if any property of the relation is
   * untyped or if the relation does not hold between classes.
   */
  addNaryRelation(rel: NaryRelation): NaryRelationView {
    rel.assertTypedProperties();
    rel.assertHoldsBetweenClasses();

    const views = rel.properties.map(p =>
      this.findOrCreateView(p.propertyType!)
    ) as ClassView[];
    let relationView = new NaryRelationView(rel, views);
    this.addView(relationView);

    return relationView;
  }

  /**
   * Creates a {@link GeneralizationView} for the given generalization and
   * adds it to the diagram, creating views for the general and specific
   * classifiers when these are not yet depicted. The general classifier's
   * view becomes the source of the connector and the specific classifier's
   * view becomes its target.
   */
  addGeneralization(gen: Generalization): GeneralizationView {
    let sourceView = this.findOrCreateView(gen.general!);
    let targetView = this.findOrCreateView(gen.specific!);

    let generalizationView = new GeneralizationView(
      gen,
      sourceView,
      targetView
    );
    this.addView(generalizationView);

    return generalizationView;
  }

  override toJSON(): any {
    const object: any = {
      type: OntoumlType.DIAGRAM,
      owner: this.owner?.id || null,
      views: this.views.map(v => v.id)
    };

    return { ...object, ...super.toJSON() };
  }
}
