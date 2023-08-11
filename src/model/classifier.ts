import _ from 'lodash';
import { Package, Stereotype, Decoratable, Generalization, GeneralizationSet, Property, Class, Relation, OntoumlType } from '..';

export abstract class Classifier<T extends Classifier<T, S>, S extends Stereotype> extends Decoratable<S> {
  isAbstract: boolean;
  properties: Property[];

  constructor(type: OntoumlType, base?: Partial<Classifier<T, S>>) {
    super(type, base);

    this.isAbstract = base?.isAbstract || false;
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

    return root.getGeneralizations()
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

    return root.getGeneralizationSets()
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

  // TODO: Update with references
  /**
   * 
   * @returns returns relations connected to the classifier.
   */
  getRelations(): Relation[] {
    this.assertProject();

    let relations = this.project!.getRelations()
                                 .filter(r => r.getMembers().includes(this));
    
    return [...new Set(relations)];
  }

  /**
   * 
   * @returns returns relations whose target is the classifier.
   */
  getIncomingRelations(): Relation[] {
    this.assertProject();
    
    return this.project!.getBinaryRelations()
                        .filter(r => r.getTarget() === this);
  }

  /**
   * 
   * @returns returns relations whose source is the classifier.
   */
  getOutgoingRelations(): Relation[] {
    this.assertProject();
    
    return this.project!.getBinaryRelations()
                        .filter(r => r.getSource() === this);
  }

  /**
   * 
   * @returns returns relations connected to the classifier or one of its ancestors.
   */
  getAllRelations(): Relation[] {
    let relations = this.getAncestors().flatMap(a => a.getRelations());
    return [...new Set(relations)];
  }

  /**
   * 
   * @returns returns relations whose target is the classifier or one of its ancestors.
   */
  getAllIncomingRelations(): Relation[] {
    return this.getAncestors().flatMap(a => a.getIncomingRelations());
  }

  /**
   * 
   * @returns returns relations whose source is the classifier or one of its ancestors.
   */
  getAllOutgoingRelations(): Relation[] {
    return this.getAncestors().flatMap(a => a.getOutgoingRelations());
  }

  /**
   * 
   * @returns returns all high-arity relations connected to the classifier.
   */
  getHighArityRelations(): Relation[] {
    return this.getRelations().filter( r => r.isHighArity())
  }

  /**
   * 
   * @returns returns all high-arity relations connected to the classifier or one of its ancestors.
   */
  getAllHighArityRelations(): Relation[] {
    return this.getAncestors().flatMap(a => a.getHighArityRelations());
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
