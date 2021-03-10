import _ from 'lodash';
import { Package, Stereotype, Decoratable, Generalization, GeneralizationSet, Property, Class, Relation } from '..';

export abstract class Classifier<T extends Classifier<T, S>, S extends Stereotype> extends Decoratable<S> {
  isAbstract: boolean;
  isDerived: boolean;
  properties: Property[];

  constructor(type: string, base?: Partial<Classifier<T, S>>) {
    super(type, base);

    this.isAbstract = base?.isAbstract || false;
    this.isDerived = base?.isDerived || false;
    this.properties = base?.properties || [];
  }

  addParent(parent: T): Generalization {
    if (this.container instanceof Package) return this.container.createGeneralization(parent, this);
    if (this.project) return this.project.model.createGeneralization(parent, this);
    return new Generalization({ general: parent, specific: this });
  }

  addChild(child: T): Generalization {
    if (this.container instanceof Package) return this.container.createGeneralization(this, child);
    if (this.project) return this.project.model.createGeneralization(this, child);
    return new Generalization({ general: this, specific: child });
  }

  getGeneralizations(): Generalization[] {
    return this.getModelOrRootPackage()
      .getAllGeneralizations()
      .filter((gen: Generalization) => this === gen.specific || this === gen.general);
  }

  getGeneralizationsWhereGeneral(): Generalization[] {
    return this.getModelOrRootPackage()
      .getAllGeneralizations()
      .filter((gen: Generalization) => this === gen.general);
  }

  getGeneralizationsWhereSpecific(): Generalization[] {
    return this.getModelOrRootPackage()
      .getAllGeneralizations()
      .filter((gen: Generalization) => this === gen.specific);
  }

  getGeneralizationSets(): GeneralizationSet[] {
    const root = this.getModelOrRootPackage();
    const generalizationSets = root.getAllGeneralizationSets();
    const generalizationSetsInvolvingClassifier: GeneralizationSet[] = [];

    if (generalizationSets) {
      generalizationSets.forEach((genset: GeneralizationSet) => {
        if (genset.getInvolvedClassifiers().includes(this)) {
          generalizationSetsInvolvingClassifier.push(genset);
        }
      });
    }

    return generalizationSetsInvolvingClassifier;
  }

  getGeneralizationSetsWhereGeneral(): GeneralizationSet[] {
    const root = this.getModelOrRootPackage();
    const generalizationSets = root.getAllGeneralizationSets();
    const generalizationSetsInvolvingClassifier: GeneralizationSet[] = [];

    if (generalizationSets) {
      generalizationSets.forEach((genset: GeneralizationSet) => {
        if (genset.getGeneral() === this) {
          generalizationSetsInvolvingClassifier.push(genset);
        }
      });
    }

    return generalizationSetsInvolvingClassifier;
  }

  getGeneralizationSetsWhereSpecific(): GeneralizationSet[] {
    const root = this.getModelOrRootPackage();
    const generalizationSets = root.getAllGeneralizationSets();
    const generalizationSetsInvolvingClassifier: GeneralizationSet[] = [];

    if (generalizationSets) {
      generalizationSets.forEach((genset: GeneralizationSet) => {
        if (genset.getSpecifics().includes(this)) {
          generalizationSetsInvolvingClassifier.push(genset);
        }
      });
    }

    return generalizationSetsInvolvingClassifier;
  }

  getGeneralizationSetsWhereCategorizer(): GeneralizationSet[] {
    if (!(this instanceof Class)) return [];

    const thisClass = this as Class;

    return this.getModelOrRootPackage()
      .getAllGeneralizationSets()
      .filter(gs => gs.categorizer === thisClass);
  }

  getParents(): T[] {
    return this.getModelOrRootPackage()
      .getAllGeneralizations()
      .filter((gen: Generalization) => this === gen.specific)
      .map((gen: Generalization) => gen.general) as T[];
  }

  getChildren(): T[] {
    return this.getModelOrRootPackage()
      .getAllGeneralizations()
      .filter((gen: Generalization) => this === gen.general)
      .map((gen: Generalization) => gen.specific) as T[];
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

  getOwnRelations(_filter?: Function): Relation[] {
    let relations = this.project.getAllRelations().filter(r => r.getMembers().includes(this));
    return [...new Set(relations)];
  }

  getOwnIncomingRelations(): Relation[] {
    return this.project
      .getAllRelations()
      .filter(r => r.isBinary())
      .filter(r => r.getTarget() === this);
  }

  getOwnOutgoingRelations(): Relation[] {
    return this.project
      .getAllRelations()
      .filter(r => r.isBinary())
      .filter(r => r.getSource() === this);
  }

  getAllRelations(_filter?: Function): Relation[] {
    let relations = this.getAncestors().flatMap(a => a.getOwnRelations());
    return [...new Set(relations)];
  }

  getAllIncomingRelations(): Relation[] {
    return this.getAncestors().flatMap(a => a.getOwnIncomingRelations());
  }

  getAllOutgoingRelations(): Relation[] {
    return this.getAncestors().flatMap(a => a.getOwnOutgoingRelations());
  }

  getOwnNaryRelations(): { position: number; relation: Relation }[] {
    throw new Error('Method unimplemented!');
  }

  getAllNaryRelations(): { position: number; relation: Relation }[] {
    throw new Error('Method unimplemented!');
  }

  getOwnDerivations(): Relation[] {
    throw new Error('Method unimplemented!');
  }

  getAllDerivations(): Relation[] {
    throw new Error('Method unimplemented!');
  }

  getAllOppositeRelationEnds(): Property[] {
    throw new Error('Method unimplemented!');
  }

  getOwnOppositeRelationEnds(): Property[] {
    throw new Error('Method unimplemented!');
  }
}
