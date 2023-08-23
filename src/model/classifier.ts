import _ from "lodash";
import {
  Package,
  Stereotype,
  Generalization,
  GeneralizationSet,
  Property,
  Class,
  Relation,
  Project,
} from "..";
import { PackageableElement } from "./packageable_element";
import { BinaryRelation } from "./binary_relation";
import { NaryRelation } from "./nary_relation";
import { Decoratable } from "./decoratable";

// TODO: check whether the first generics term "T" is really necessary; it seems redundant
export abstract class Classifier<
    T extends Classifier<T, S>,
    S extends Stereotype,
  >
  extends Decoratable<S>
  implements PackageableElement
{
  isAbstract: boolean = false;
  protected _properties: Property[] = [];

  constructor(project: Project, container?: Package) {
    super(project, container);
  }

  public override get container(): Package | undefined {
    return this.container as Package;
  }

  public override set container(newContainer: Package | undefined) {
    super.container = newContainer;
  }

  public get properties(): Property[] {
    return [...this._properties];
  }

  public set properties(value: Property[]) {
    this._properties = value;
  }

  asClass(): Class {
    if (this instanceof Class) {
      return this as Class;
    }

    throw new Error("The classifier is not an instance of Class.");
  }

  asRelation(): Relation {
    if (this instanceof Relation) {
      return this as Relation;
    }

    throw new Error("The classifier is not an instance of Relation.");
  }

  addParent(parent: T): Generalization {
    this.assertProject();
    return new Generalization(this.project!, this.container, parent, this);
  }

  addChild(child: T): Generalization {
    this.assertProject();
    return new Generalization(this.project!, this.container, this, child);
  }

  // TODO: Update methods to use references instead.
  getGeneralizations(): Generalization[] {
    return this.project!.finder.getGeneralizations().filter(
      (g) => this === g.specific || this === g.general,
    );
  }

  getGeneralizationsWhereGeneral(): Generalization[] {
    return this.getGeneralizations().filter(
      (gen: Generalization) => this === gen.general,
    );
  }

  getGeneralizationsWhereSpecific(): Generalization[] {
    return this.getGeneralizations().filter(
      (gen: Generalization) => this === gen.specific,
    );
  }

  getGeneralizationSets(): GeneralizationSet[] {
    return this.project!.finder.getGeneralizationSets().filter((gs) =>
      gs.getInvolvedClassifiers().includes(this),
    );
  }

  getGeneralizationSetsWhereGeneral(): GeneralizationSet[] {
    return this.getGeneralizationSets().filter(
      (gs) => gs.getGeneral() === this,
    );
  }

  getGeneralizationSetsWhereSpecific(): GeneralizationSet[] {
    return this.getGeneralizationSets().filter((gs) =>
      gs.getSpecifics().includes(this),
    );
  }

  getParents(): T[] {
    return this.getGeneralizations()
      .filter((g) => this === g.specific)
      .map((g) => g.general) as T[];
  }

  getChildren(): T[] {
    return this.getGeneralizations()
      .filter((g) => this === g.general)
      .map((g) => g.specific) as T[];
  }

  getAncestors(knownAncestors: T[] = []): T[] {
    const ancestors = [...knownAncestors];

    this.getParents().forEach((parent: T) => {
      if (!ancestors.includes(parent)) {
        ancestors.push(parent);
        ancestors.push(...parent.getAncestors(ancestors));
      }
    });

    return [...new Set(ancestors)];
  }

  getDescendants(knownDescendants: T[] = []): T[] {
    const descendants = [...knownDescendants];

    this.getChildren().forEach((child: T) => {
      if (!descendants.includes(child)) {
        descendants.push(child);
        descendants.push(...child.getDescendants(descendants));
      }
    });

    return [...new Set(descendants)];
  }

  getFilteredAncestors(filter: (ancestor: T) => boolean): T[] {
    return this.getAncestors().filter(filter);
  }

  getFilteredDescendants(filter: (descendent: T) => boolean): T[] {
    return this.getDescendants().filter(filter);
  }

  // TODO: Update with references
  /**
   *
   * @returns returns relations connected to the classifier.
   */
  getRelations(): Relation[] {
    this.assertProject();

    let relations = this.project!.finder.getRelations().filter((r) =>
      r.getMembers().includes(this),
    );

    return [...new Set(relations)];
  }

  /**
   *
   * @returns returns relations whose target is the classifier.
   */
  getIncomingRelations(): BinaryRelation[] {
    this.assertProject();

    return this.project!.finder.getBinaryRelations().filter(
      (r) => r.getTarget() === this,
    );
  }

  /**
   *
   * @returns returns relations whose source is the classifier.
   */
  getOutgoingRelations(): BinaryRelation[] {
    this.assertProject();

    return this.project!.finder.getBinaryRelations().filter(
      (r) => r.getSource() === this,
    );
  }

  /**
   *
   * @returns returns relations connected to the classifier or one of its ancestors.
   */
  getAllRelations(): Relation[] {
    let relations = this.getAncestors().flatMap((a) => a.getRelations());
    return [...new Set(relations)];
  }

  /**
   *
   * @returns returns relations whose target is the classifier or one of its ancestors.
   */
  getAllIncomingRelations(): BinaryRelation[] {
    return this.getAncestors().flatMap((a) => a.getIncomingRelations());
  }

  /**
   *
   * @returns returns relations whose source is the classifier or one of its ancestors.
   */
  getAllOutgoingRelations(): BinaryRelation[] {
    return this.getAncestors().flatMap((a) => a.getOutgoingRelations());
  }

  /**
   *
   * @returns returns all high-arity relations connected to the classifier.
   */
  getNaryRelations(): NaryRelation[] {
    return this.getRelations().filter((r) => r.isNary());
  }

  /**
   *
   * @returns returns all high-arity relations connected to the classifier or one of its ancestors.
   */
  getAllNaryRelations(): NaryRelation[] {
    return this.getAncestors().flatMap((a) => a.getNaryRelations());
  }

  getOwnDerivations(): BinaryRelation[] {
    throw new Error("Method unimplemented!");
  }

  getAllDerivations(): BinaryRelation[] {
    throw new Error("Method unimplemented!");
  }

  getAllOppositeRelationEnds(): Property[] {
    throw new Error("Method unimplemented!");
  }

  getOwnOppositeRelationEnds(): Property[] {
    throw new Error("Method unimplemented!");
  }

  override toJSON(): any {
    const object = {
      isAbstract: this.isAbstract,
      properties: this.properties.map((p) => p.id),
    };

    return { ...object, ...super.toJSON() };
  }
}
