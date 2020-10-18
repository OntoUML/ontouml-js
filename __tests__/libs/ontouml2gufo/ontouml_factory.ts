import { AggregationKind, ClassStereotype, OntologicalNature, OntoumlType, RelationStereotype } from '@constants/.';
import uniqid from 'uniqid';
import {
  IPackage,
  IClass,
  IRelation,
  IProperty,
  IGeneralization,
  IGeneralizationSet,
  IElement,
  ILiteral,
  IClassifier
} from '@types';

export default class OntoumlFactory {
  static createClass(name: string, stereotype: ClassStereotype, nature: OntologicalNature[]): IClass {
    return {
      type: OntoumlType.CLASS_TYPE,
      id: uniqid(),
      name: name,
      description: null,
      properties: null,
      literals: null,
      propertyAssignments: null,
      stereotypes: stereotype ? [stereotype] : null,
      isAbstract: false,
      isDerived: false,
      allowed: nature ? [...nature] : null,
      isExtensional: null,
      isPowertype: null,
      order: null
    };
  }

  static cloneClass(base: Partial<IClass>): IClass {
    return {
      type: OntoumlType.CLASS_TYPE,
      id: base.id || uniqid(),
      name: base.name || null,
      description: base.description || null,
      properties: base.properties || null,
      literals: null,
      propertyAssignments: base.propertyAssignments || null,
      stereotypes: base.stereotypes || null,
      isAbstract: base.isAbstract || false,
      isDerived: base.isDerived || false,
      allowed: base.allowed || null,
      isExtensional: base.isExtensional || null,
      isPowertype: base.isPowertype || null,
      order: base.order || null
    };
  }

  static createKind(name: string): IClass {
    return this.createClass(name, ClassStereotype.KIND, [OntologicalNature.functional_complex]);
  }

  static cloneKind(base: Partial<IClass>): IClass {
    base.stereotypes = [ClassStereotype.KIND];
    base.allowed = [OntologicalNature.functional_complex];
    return this.cloneClass(base);
  }

  static createCollective(name: string): IClass {
    let _class = this.createClass(name, ClassStereotype.COLLECTIVE, [OntologicalNature.collective]);
    _class.isExtensional = false;
    return _class;
  }

  static createQuantity(name: string): IClass {
    return this.createClass(name, ClassStereotype.QUANTITY, [OntologicalNature.quantity]);
  }

  static createRelator(name: string): IClass {
    return this.createClass(name, ClassStereotype.RELATOR, [OntologicalNature.relator]);
  }

  static createMode(name: string): IClass {
    return this.createClass(name, ClassStereotype.MODE, [OntologicalNature.intrinsic_mode]);
  }

  static createQuality(name: string): IClass {
    return this.createClass(name, ClassStereotype.QUALITY, [OntologicalNature.quality]);
  }

  static createSubkind(name: string): IClass {
    return this.createClass(name, ClassStereotype.SUBKIND, [OntologicalNature.functional_complex]);
  }

  static createPhase(name: string): IClass {
    return this.createClass(name, ClassStereotype.PHASE, [OntologicalNature.functional_complex]);
  }

  static createRole(name: string): IClass {
    return this.createClass(name, ClassStereotype.ROLE, [OntologicalNature.functional_complex]);
  }

  static createCategory(name: string): IClass {
    return this.createClass(name, ClassStereotype.CATEGORY, [OntologicalNature.functional_complex]);
  }

  static createMixin(name: string): IClass {
    return this.createClass(name, ClassStereotype.MIXIN, [OntologicalNature.functional_complex]);
  }

  static createRoleMixin(name: string): IClass {
    return this.createClass(name, ClassStereotype.ROLE_MIXIN, [OntologicalNature.functional_complex]);
  }

  static createPhaseMixin(name: string): IClass {
    return this.createClass(name, ClassStereotype.PHASE_MIXIN, [OntologicalNature.functional_complex]);
  }

  static createSituation(name: string): IClass {
    return this.createClass(name, ClassStereotype.SITUATION, [OntologicalNature.situation]);
  }

  static createEvent(name: string): IClass {
    return this.createClass(name, ClassStereotype.EVENT, [OntologicalNature.event]);
  }

  static createAbstract(name: string): IClass {
    return this.createClass(name, ClassStereotype.ABSTRACT, [OntologicalNature.abstract]);
  }

  static createType(name: string): IClass {
    return this.createClass(name, ClassStereotype.TYPE, [OntologicalNature.type]);
  }

  static createDatatype(name: string): IClass {
    return this.createClass(name, ClassStereotype.DATATYPE, [OntologicalNature.abstract]);
  }

  static createEnumeration(name: string, literals: string[]): IClass {
    let enumeration = this.createClass(name, ClassStereotype.ENUMERATION, [OntologicalNature.abstract]);
    enumeration.literals = literals.map(literal => this.createLiteral(literal));
    return enumeration;
  }

  static createLiteral(name: string): ILiteral {
    return {
      type: OntoumlType.LITERAL_TYPE,
      id: uniqid(),
      name: name,
      description: null,
      propertyAssignments: null
    };
  }

  static createRelation(
    name: string,
    stereotype: RelationStereotype,
    source: IClassifier,
    target: IClassifier,
    shouldResolveReferences: boolean = false
  ): IRelation {
    let relation: IRelation = {
      type: OntoumlType.RELATION_TYPE,
      id: uniqid(),
      name: name,
      description: null,
      properties: [this.createProperty(null, source), this.createProperty(null, target)],
      propertyAssignments: null,
      stereotypes: stereotype ? [stereotype] : null,
      isAbstract: false,
      isDerived: false
    };

    if (shouldResolveReferences) {
      relation.properties[0].propertyType = source;
      relation.properties[1].propertyType = target;
    }

    return relation;
  }

  static createMediation(name: string, relator: IClass, mediated: IClass, shouldResolveReferences: boolean = false): IRelation {
    const mediation = this.createRelation(name, RelationStereotype.MEDIATION, relator, mediated, shouldResolveReferences);
    mediation.properties[1].isReadOnly = true;
    mediation.properties[1].cardinality = '1';
    return mediation;
  }

  static createMaterial(name: string, source: IClass, target: IClass, shouldResolveReferences: boolean = false): IRelation {
    const material = this.createRelation(name, RelationStereotype.MATERIAL, source, target, shouldResolveReferences);
    material.properties[0].cardinality = '1..*';
    material.properties[1].cardinality = '1..*';
    return material;
  }

  static createCharacterization(
    name: string,
    aspect: IClass,
    bearer: IClass,
    shouldResolveReferences: boolean = false
  ): IRelation {
    const characterization = this.createRelation(
      name,
      RelationStereotype.CHARACTERIZATION,
      aspect,
      bearer,
      shouldResolveReferences
    );
    characterization.properties[1].isReadOnly = true;
    characterization.properties[1].cardinality = '1';
    return characterization;
  }

  static createTermination(name: string, endurant: IClass, event: IClass, shouldResolveReferences: boolean = false): IRelation {
    const characterization = this.createRelation(name, RelationStereotype.TERMINATION, endurant, event, shouldResolveReferences);
    characterization.properties[0].isReadOnly = true;
    return characterization;
  }

  static createCreation(name: string, endurant: IClass, event: IClass, shouldResolveReferences: boolean = false): IRelation {
    const characterization = this.createRelation(name, RelationStereotype.CREATION, endurant, event, shouldResolveReferences);
    characterization.properties[0].isReadOnly = true;
    characterization.properties[1].isReadOnly = true;
    return characterization;
  }

  static createPartWhole(name: string, source: IClassifier, target: IClassifier) {
    const relation: IRelation = this.createRelation(name, null, source, target);
    relation.properties[1].aggregationKind = AggregationKind.COMPOSITE;
    return relation;
  }

  static createProperty(name: string, type?: IClassifier): IProperty {
    return {
      type: OntoumlType.PROPERTY_TYPE,
      id: uniqid(),
      name: name,
      description: null,
      propertyType: type
        ? {
            type: type.type,
            id: type.id
          }
        : null,
      cardinality: '1..*',
      isDerived: false,
      isOrdered: false,
      isReadOnly: false,
      stereotypes: null,
      propertyAssignments: null,
      subsettedProperties: null,
      redefinedProperties: null,
      aggregationKind: AggregationKind.NONE
    };
  }

  static addAttribute(owner: IClass, name: string, type?: IClass): IProperty {
    const attr = this.createProperty(name, type);

    if (!owner.properties) owner.properties = [];

    owner.properties.push(attr);
    return attr;
  }

  static createGeneralization(specific: IClassifier, general: IClassifier): IGeneralization {
    return {
      type: OntoumlType.GENERALIZATION_TYPE,
      id: uniqid(),
      name: null,
      description: null,
      propertyAssignments: null,
      general: {
        type: general.type,
        id: general.id
      },
      specific: {
        type: specific.type,
        id: specific.id
      }
    };
  }

  static createGeneralizationSet(
    name: string,
    generalizations: IGeneralization[],
    isDisjoint: boolean,
    isComplete: boolean
  ): IGeneralizationSet {
    return {
      type: OntoumlType.GENERALIZATION_SET_TYPE,
      id: uniqid(),
      name,
      description: null,
      propertyAssignments: null,
      categorizer: null,
      generalizations: generalizations.map(gen => {
        return { type: OntoumlType.GENERALIZATION_TYPE, id: gen.id };
      }),
      isDisjoint,
      isComplete
    };
  }
  static createPartition(name: string, generalizations: IGeneralization[]): IGeneralizationSet {
    return this.createGeneralizationSet(name, generalizations, true, true);
  }

  static createPackage(name: string, contents: IElement[]): IPackage {
    return {
      type: OntoumlType.PACKAGE_TYPE,
      id: uniqid(),
      name: name,
      description: null,
      contents: [...contents],
      propertyAssignments: null
    };
  }
}
