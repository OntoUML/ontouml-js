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
  Project,
} from ".";
import { BinaryRelation } from "./model/binary_relation";
import { NaryRelation } from "./model/nary_relation";
import { Path } from "./shape/path";
import { Rectangle } from "./shape/rectangle";
import { Shape } from "./shape/shape";
import { Text } from "./shape/text";
import { NaryRelationView } from "./view/nary_relation_view";

export class Diagram extends OntoumlElement {
  owner?: ModelElement;
  contents: View<any>[] = [];

  constructor(project: Project, owner?: ModelElement) {
    super(project);
    this.owner = owner;
  }

  getContents(): OntoumlElement[] {
    return [...this.contents];
  }

  getClassViews(): ClassView[] {
    return this.contents?.filter(
      (view) => view instanceof ClassView,
    ) as ClassView[];
  }

  getRelationViews(): BinaryRelationView[] {
    return this.contents.filter(
      (view) => view instanceof BinaryRelationView,
    ) as BinaryRelationView[];
  }

  getGeneralizationViews(): GeneralizationView[] {
    return this.contents.filter(
      (view) => view instanceof GeneralizationView,
    ) as GeneralizationView[];
  }

  getGeneralizationSetViews(): GeneralizationSetView[] {
    return this.contents.filter(
      (view) => view instanceof GeneralizationSetView,
    ) as GeneralizationSetView[];
  }

  getPackageViews(): PackageView[] {
    return this.contents.filter(
      (view) => view instanceof PackageView,
    ) as PackageView[];
  }

  getRealizedModelElements(): ModelElement[] {
    return this.contents.map((view) => view.element);
  }

  getShapes(): Shape[] {
    return this.contents?.flatMap((view) => view.getContents()) || [];
  }

  getRectangles(): Rectangle[] {
    return this.getShapes().filter(
      (s) => s instanceof Rectangle,
    ) as Rectangle[];
  }

  getPaths(): Path[] {
    return this.getShapes().filter((s) => s instanceof Path) as Path[];
  }

  getTexts(): Text[] {
    return this.getShapes().filter((s) => s instanceof Text) as Text[];
  }

  addView(element: View<any>): void {
    if (!element) {
      return;
    }

    this.contents.push(element);
  }

  addElements(elements: View<any>[]): void {
    if (!elements) {
      return;
    }

    elements.forEach((e) => this.addView(e));
  }

  setElements(elements: View<any>[]): void {
    this.contents = [];

    if (!elements) {
      return;
    }

    this.addElements(elements);
  }

  findElementById(id: string): View<any> | undefined {
    return this.contents.find((view) => view.element.id === id);
  }

  findView(modelElement: ModelElement): View<any> | undefined {
    return this.contents.find((view) => view.element === modelElement);
  }

  containsView(modelElement: ModelElement): boolean {
    return !!this.findView(modelElement) !== null;
  }

  addModelElements(modelElements: ModelElement[]): View<any>[] | undefined {
    if (!modelElements) {
      throw new Error("Invalid parameter. `modelElements` cannot be null");
    }

    return modelElements
      .filter((e) => e !== null)
      .map((e) => this.addModelElement(e));
  }

  addModelElement(modelElement: ModelElement): View<any> {
    if (!modelElement)
      throw new Error(
        "Invalid parameter. The supplied element cannot be null.",
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
      "Invalid parameter. The supplied element cannot be visualized in a diagram. `modelElement`: " +
        modelElement,
    );
  }

  findOrCreateView(modelElement: ModelElement): View<any> {
    if (!modelElement)
      throw new Error(
        "Failed to get or add view. Input element is null or undefined.",
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
    let sourceView = this.findOrCreateView(rel.getSource()!);

    rel.assertTypedTarget();
    let targetView = this.findOrCreateView(rel.getTarget()!);

    let relationView = new BinaryRelationView(rel, sourceView, targetView);

    this.addView(relationView);
    return relationView;
  }

  addNaryRelation(rel: NaryRelation): NaryRelationView {
    rel.assertTypedProperties();
    rel.assertHoldsBetweenClasses();

    const views = rel.properties.map((p) =>
      this.findOrCreateView(p.propertyType!),
    ) as ClassView[];
    let relationView = new NaryRelationView(rel, views);
    this.addView(relationView);

    return relationView;
  }

  addGeneralization(gen: Generalization): GeneralizationView {
    gen.assertGeneralDefined();
    let sourceView = this.findOrCreateView(gen.general!);

    gen.assertSpecificDefined();
    let targetView = this.findOrCreateView(gen.specific!);

    let generalizationView = new GeneralizationView(
      gen,
      sourceView,
      targetView,
    );
    this.addView(generalizationView);

    return generalizationView;
  }

  override toJSON(): any {
    const object: any = {
      type: OntoumlType.DIAGRAM,
      owner: this.owner?.id || null,
      contents: this.contents.map((v) => v.id),
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
        "owner",
      );
    }
  }

  clone(): OntoumlElement {
    throw new Error("Method not implemented.");
  }
  replace(originalElement: OntoumlElement, newElement: OntoumlElement): void {
    throw new Error("Method not implemented.");
  }
}
