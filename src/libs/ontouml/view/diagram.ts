import {
  ModelElement,
  OntoumlElement,
  OntoumlType,
  ElementView,
  Class,
  Generalization,
  GeneralizationSet,
  Package,
  Relation,
  ClassView,
  GeneralizationSetView,
  GeneralizationView,
  PackageView,
  RelationView
} from '..';

export class Diagram extends OntoumlElement {
  owner: ModelElement;
  contents: ElementView<any, any>[];

  constructor(base?: Partial<Diagram>) {
    super(OntoumlType.DIAGRAM, base);
    this.owner = base?.owner || null;
    this.contents = base?.contents || [];
  }

  getContents(): OntoumlElement[] {
    return [...this.contents];
  }

  getClassViews(): ClassView[] {
    return this.contents?.filter(view => view instanceof ClassView) as ClassView[];
  }

  getRelationViews(): RelationView[] {
    return this.contents?.filter(view => view instanceof RelationView) as RelationView[];
  }

  getGeneralizationViews(): GeneralizationView[] {
    return this.contents?.filter(view => view instanceof GeneralizationView) as GeneralizationView[];
  }

  getGeneralizationSetViews(): GeneralizationSetView[] {
    return this.contents?.filter(view => view instanceof GeneralizationSetView) as GeneralizationSetView[];
  }

  getRealizedModelElements(): ModelElement[] {
    return this.contents.map(view => view.modelElement);
  }

  addElement(element: ElementView<any, any>): void {
    if (!element) return;
    element.setContainer(this);
    this.contents.push(element);
  }

  addElements(elements: ElementView<any, any>[]): void {
    if (!elements) return;
    elements.forEach(e => this.addElement(e));
  }

  setElements(elements: ElementView<any, any>[]): void {
    this.contents = [];
    if (!elements) return;
    this.addElements(elements);
  }

  findElementById(id: string): ElementView<any, any> {
    return this.contents.find(view => view.modelElement.id === id);
  }

  findView(modelElement: ModelElement): ElementView<any, any> {
    return this.contents.find(view => view.modelElement === modelElement);
  }

  containsView(modelElement: ModelElement): boolean {
    return this.findView(modelElement) !== null;
  }

  addModelElements(modelElements: ModelElement[]): ElementView<any, any>[] {
    return modelElements?.filter(e => e !== null).map(e => this.addModelElement(e));
  }

  addModelElement(modelElement: ModelElement): ElementView<any, any> {
    if (modelElement instanceof Class) return this.addClass(modelElement);
    if (modelElement instanceof Relation && modelElement.isBinary()) return this.addBinaryRelation(modelElement);
    if (modelElement instanceof Generalization) return this.addGeneralization(modelElement);
    if (modelElement instanceof GeneralizationSet) return this.addGeneralizationSet(modelElement);
    if (modelElement instanceof Package) return this.addPackage(modelElement);

    return null;
  }

  findOrCreateView(modelElement: ModelElement): ElementView<any, any> {
    if (!modelElement) throw new Error('Failed to get or add view. Input element is null or undefined.');
    return this.findView(modelElement) || this.addModelElement(modelElement);
  }

  addClass(clazz: Class): ClassView {
    let view = new ClassView({ modelElement: clazz });
    this.addElement(view);
    return view;
  }

  addGeneralizationSet(gs: GeneralizationSet): GeneralizationSetView {
    let view = new GeneralizationSetView({ modelElement: gs });
    this.addElement(view);
    return view;
  }

  addPackage(gs: Package): PackageView {
    let view = new PackageView({ modelElement: gs });
    this.addElement(view);
    return view;
  }

  addBinaryRelation(relation: Relation): RelationView {
    let sourceView = this.findOrCreateView(relation.getSource());
    let targetView = this.findOrCreateView(relation.getTarget());

    let relationView = new RelationView({
      modelElement: relation,
      source: sourceView,
      target: targetView
    });

    this.addElement(relationView);
    return relationView;
  }

  addGeneralization(generalization: Generalization): GeneralizationView {
    let sourceView = this.findOrCreateView(generalization.general);
    let targetView = this.findOrCreateView(generalization.specific);

    let generalizationView = new GeneralizationView({
      modelElement: generalization,
      source: sourceView,
      target: targetView
    });

    this.addElement(generalizationView);
    return generalizationView;
  }

  toJSON(): any {
    const serialization = {
      owner: null,
      contents: null
    };

    Object.assign(serialization, super.toJSON());

    serialization.owner = this.owner?.getReference() ?? null;

    return serialization;
  }

  resolveReferences(elementReferenceMap: Map<string, OntoumlElement>): void {
    const { owner } = this;

    if (owner) {
      this.owner = OntoumlElement.resolveReference(owner, elementReferenceMap, this, 'owner');
    }
  }
}
