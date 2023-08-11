import {
  ModelElement,
  OntoumlElement,
  OntoumlType,
  View,
  Class,
  Generalization,
  GeneralizationSet,
  Package,
  Relation,
  ClassView,
  GeneralizationSetView,
  GeneralizationView,
  PackageView,
  BinaryRelationView,
  Project
} from '.';
import { Path } from './shape/path';
import { Rectangle } from './shape/rectangle';
import { Shape } from './shape/shape';
import { Text } from './shape/text';

export class Diagram extends OntoumlElement {
  owner?: ModelElement;
  contents: View<any>[];

  constructor(project: Project) {
    super(project);
    this.contents = [];
  }

  getContents(): OntoumlElement[] {
    return [...this.contents];
  }

  getClassViews(): ClassView[] {
    return this.contents?.filter(view => view instanceof ClassView) as ClassView[];
  }

  getRelationViews(): BinaryRelationView[] {
    return this.contents.filter(view => view instanceof BinaryRelationView) as BinaryRelationView[];
  }

  getGeneralizationViews(): GeneralizationView[] {
    return this.contents.filter(view => view instanceof GeneralizationView) as GeneralizationView[];
  }

  getGeneralizationSetViews(): GeneralizationSetView[] {
    return this.contents.filter(view => view instanceof GeneralizationSetView) as GeneralizationSetView[];
  }

  getPackageViews(): PackageView[] {
    return this.contents.filter(view => view instanceof PackageView) as PackageView[];
  }

  getRealizedModelElements(): ModelElement[] {
    return this.contents.map(view => view.element);
  }

  getShapes(): Shape[] {
    return this.contents?.map(view => view.shape) || [];
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

  addElement(element: View<any>): void {
    if (!element) return;
    element.setContainer(this);
    this.contents.push(element);
  }

  addElements(elements: View<any>[]): void {
    if (!elements) return;
    elements.forEach(e => this.addElement(e));
  }

  setElements(elements: View<any>[]): void {
    this.contents = [];
    if (!elements) return;
    this.addElements(elements);
  }

  findElementById(id: string): View<any> | undefined {
    return this.contents.find(view => view.element.id === id);
  }

  findView(modelElement: ModelElement): View<any>  | undefined{
    return this.contents.find(view => view.element === modelElement);
  }

  containsView(modelElement: ModelElement): boolean {
    return !!this.findView(modelElement) !== null;
  }

  addModelElements(modelElements: ModelElement[]): View<any>[] | undefined {
    if(!modelElements){
      throw new Error('Invalid parameter. `modelElements` cannot be null')
    }
    
    return modelElements.filter(e => e !== null)
                         .map(e => this.addModelElement(e));
  }

  addModelElement(modelElement: ModelElement): View<any> {
    if(!modelElement)
      throw new Error('Invalid parameter. The supplied element cannot be null.');
    
    if (modelElement instanceof Class) return this.addClass(modelElement);
    if (modelElement instanceof Relation && modelElement.isBinary()) return this.addBinaryRelation(modelElement);
    if (modelElement instanceof Generalization) return this.addGeneralization(modelElement);
    if (modelElement instanceof GeneralizationSet) return this.addGeneralizationSet(modelElement);
    if (modelElement instanceof Package) return this.addPackage(modelElement);

    throw new Error('Invalid parameter. The supplied element cannot be visualized in a diagram. `modelElement`: '+modelElement);
  }

  findOrCreateView(modelElement: ModelElement): View<any> {
    if (!modelElement) throw new Error('Failed to get or add view. Input element is null or undefined.');
    return this.findView(modelElement) || this.addModelElement(modelElement);
  }

  addClass(clazz: Class): ClassView {
    let view = new ClassView(this.project, { element: clazz });
    this.addElement(view);
    return view;
  }

  addGeneralizationSet(gs: GeneralizationSet): GeneralizationSetView {
    let view = new GeneralizationSetView({ element: gs });
    this.addElement(view);
    return view;
  }

  addPackage(gs: Package): PackageView {
    let view = new PackageView({ element: gs });
    this.addElement(view);
    return view;
  }

  addBinaryRelation(relation: Relation): BinaryRelationView {
    relation.assertTypedSource();
    let sourceView = this.findOrCreateView(relation.getSource()!);

    relation.assertTypedTarget();
    let targetView = this.findOrCreateView(relation.getTarget()!);

    let relationView = new BinaryRelationView({
      element: relation,
      source: sourceView,
      target: targetView
    });

    this.addElement(relationView);
    return relationView;
  }

  addGeneralization(generalization: Generalization): GeneralizationView {
    generalization.assertGeneralDefined();
    let sourceView = this.findOrCreateView(generalization.general!);

    generalization.assertSpecificDefined();
    let targetView = this.findOrCreateView(generalization.specific!);

    let generalizationView = new GeneralizationView({
      element: generalization,
      source: sourceView,
      target: targetView
    });

    this.addElement(generalizationView);
    return generalizationView;
  }

  toJSON(): any {
    const object : any = {
      type: OntoumlType.DIAGRAM,
      owner: null,
      contents: null
    };

    Object.assign(object, super.toJSON());

    object.owner = this.owner?.id ?? null;

    return object;
  }

  resolveReferences(elementReferenceMap: Map<string, OntoumlElement>): void {
    const { owner } = this;

    if (owner) {
      this.owner = OntoumlElement.resolveReference(owner, elementReferenceMap, this, 'owner');
    }
  }

  clone(): OntoumlElement {
    throw new Error('Method not implemented.');
  }
  replace(originalElement: OntoumlElement, newElement: OntoumlElement): void {
    throw new Error('Method not implemented.');
  }
}
