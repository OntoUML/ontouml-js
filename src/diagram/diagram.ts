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

export class Diagram extends OntoumlElement implements ProjectElement {
  owner?: ModelElement;
  private _project: Project;
  private _views: Set<View<any>> = new Set();

  constructor(project: Project) {
    super();

    utils.assertValue(project);
    this._project = project;
  }

  public get views(): View<any>[] {
    return [...this._views];
  }

  public set views(value: View<any>[]) {
    this._views = new Set(value);
  }

  get project(): Project {
    return this._project;
  }

  set project(value: Project) {
    utils.assertValue(value);
    this._project = value;
  }

  override getAllContents(): (View<any> | Shape)[] {
    const views = this.views;
    const shapes = views.flatMap(v => v.shapes);

    return [...views, ...shapes];
  }

  override getContents(): OntoumlElement[] {
    return this.views;
  }

  getClassViews(): ClassView[] {
    return this.views.filter(view => view instanceof ClassView) as ClassView[];
  }

  getRelationViews(): BinaryRelationView[] {
    return this.views.filter(
      view => view instanceof BinaryRelationView
    ) as BinaryRelationView[];
  }

  getGeneralizationViews(): GeneralizationView[] {
    return this.views.filter(
      view => view instanceof GeneralizationView
    ) as GeneralizationView[];
  }

  getGeneralizationSetViews(): GeneralizationSetView[] {
    return this.views.filter(
      view => view instanceof GeneralizationSetView
    ) as GeneralizationSetView[];
  }

  getPackageViews(): PackageView[] {
    return this.views.filter(
      view => view instanceof PackageView
    ) as PackageView[];
  }

  getRealizedModelElements(): ModelElement[] {
    return this.views.map(view => view.element);
  }

  getShapes(): Shape[] {
    return this.views.flatMap(view => view.getContents()) || [];
  }

  getRectangles(): Rectangle[] {
    return this.getShapes().filter(s => s instanceof Rectangle) as Rectangle[];
  }

  getPaths(): Path[] {
    return this.getShapes().filter(s => s instanceof Path) as Path[];
  }

  getTexts(): Text[] {
    return this.getShapes().filter(s => s instanceof Text) as Text[];
  }

  addView(element: View<any>): void {
    if (!element) {
      return;
    }

    this._views.add(element);
  }

  addElements(elements: View<any>[]): void {
    if (!elements) {
      return;
    }

    elements.forEach(e => this.addView(e));
  }

  setElements(elements: View<any>[]): void {
    this.views = [];

    if (!elements) {
      return;
    }

    this.addElements(elements);
  }

  findElementById(id: string): View<any> | undefined {
    return this.views.find(view => view.element.id === id);
  }

  findView(modelElement: ModelElement): View<any> | undefined {
    return this.views.find(view => view.element === modelElement);
  }

  containsView(modelElement: ModelElement): boolean {
    return !!this.findView(modelElement) !== null;
  }

  addModelElements(modelElements: ModelElement[]): View<any>[] | undefined {
    if (!modelElements) {
      throw new Error('Invalid parameter. `modelElements` cannot be null');
    }

    return modelElements
      .filter(e => e !== null)
      .map(e => this.addModelElement(e));
  }

  addModelElement(modelElement: ModelElement): View<any> {
    if (!modelElement)
      throw new Error(
        'Invalid parameter. The supplied element cannot be null.'
      );

    if (modelElement instanceof Class) return this.addClass(modelElement);
    if (modelElement instanceof BinaryRelation && modelElement.isBinary())
      return this.addBinaryRelation(modelElement);
    if (modelElement instanceof NaryRelation && modelElement.isBinary())
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

  findOrCreateView(modelElement: ModelElement): View<any> {
    if (!modelElement)
      throw new Error(
        'Failed to get or add view. Input element is null or undefined.'
      );
    return this.findView(modelElement) || this.addModelElement(modelElement);
  }

  addClass(clazz: Class): ClassView {
    let view = new ClassView(clazz);
    this.addView(view);
    return view;
  }

  addGeneralizationSet(gs: GeneralizationSet): GeneralizationSetView {
    let view = new GeneralizationSetView(gs);
    this.addView(view);
    return view;
  }

  addPackage(pkg: Package): PackageView {
    let view = new PackageView(pkg);
    this.addView(view);
    return view;
  }

  addBinaryRelation(rel: BinaryRelation): BinaryRelationView {
    rel.assertTypedSource();
    let sourceView = this.findOrCreateView(rel.source!);

    rel.assertTypedTarget();
    let targetView = this.findOrCreateView(rel.target!);

    let relationView = new BinaryRelationView(rel, sourceView, targetView);

    this.addView(relationView);
    return relationView;
  }

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

  resolveReferences(elementReferenceMap: Map<string, OntoumlElement>): void {
    const { owner } = this;

    if (owner) {
      this.owner = OntoumlElement.resolveReference(
        owner,
        elementReferenceMap,
        this,
        'owner'
      );
    }
  }
}
