import _ from 'lodash';
import { Package, Stereotype, Decoratable, Generalization, GeneralizationSet, Property, Class, Relation, OntoumlType } from '..';

export abstract class Classifier<T extends Classifier<T, S>, S extends Stereotype> extends Decoratable<S> {
  isAbstract: boolean;
  isDerived: boolean;
  properties: Property[];

  constructor(type: OntoumlType, base?: Partial<Classifier<T, S>>) {
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

  // TODO: Update methods to use references instead.
  getGeneralizations(): Generalization[] {
    let root : Package | null = this.getRoot();
    
    if(!root){
      throw new Error('Root package is null. Cannot retrieve generalizations.');
    }

    return root.getAllGeneralizations()
              .filter(g => this === g.specific || this === g.general);
  }

  getGeneralizationsWhereGeneral(): Generalization[] {
    return this.getGeneralizations()
               .filter((gen: Generalization) => this === gen.general);
  }

  getGeneralizationsWhereSpecific(): Generalization[] {
    return this.getGeneralizations()
               .filter((gen: Generalization) => this === gen.specific);
  }

  getGeneralizationSets(): GeneralizationSet[] {
    let root : Package | null = this.getRoot();
    
    if(!root){
      throw new Error('Root package is null. Cannot retrieve generalization sets.');
    }

    return root.getAllGeneralizationSets()
               .filter(gs => gs.getInvolvedClassifiers().includes(this));
  }

  getGeneralizationSetsWhereGeneral(): GeneralizationSet[] {
    return this.getGeneralizationSets()
               .filter(gs => gs.getGeneral() === this);
  }

  getGeneralizationSetsWhereSpecific(): GeneralizationSet[] {
    return this.getGeneralizationSets()
               .filter(gs => gs.getSpecifics().includes(this));
  }

  getParents(): T[] {
    return this.getGeneralizations()
               .filter(g => this === g.specific)
               .map(g => g.general) as T[];
  }

  getChildren(): T[] {
    return this.getGeneralizations()
               .filter(g => this === g.general)
               .map(g => g.specific) as T[];
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
