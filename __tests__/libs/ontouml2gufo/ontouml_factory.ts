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
  // TODO: replace with Package this.createClass(?name,?stereotype,?nature,?base)
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

  // TODO: replace with Package this.createClass(base.name,base.stereotypes,base.restrictedTo,base)
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

  // TODO: replace with Package this.createKind(name,?base)
  static createKind(name: string): IClass {
    return this.createClass(name, ClassStereotype.KIND, [OntologicalNature.functional_complex]);
  }

  // TODO: replace with Package this.createKind(base.name,base)
  static cloneKind(base: Partial<IClass>): IClass {
    base.stereotypes = [ClassStereotype.KIND];
    base.allowed = [OntologicalNature.functional_complex];
    return this.cloneClass(base);
  }

  // TODO: replace with Package this.createCollective(?name,?base)
  static createCollective(name: string): IClass {
    let _class = this.createClass(name, ClassStereotype.COLLECTIVE, [OntologicalNature.collective]);
    _class.isExtensional = false;
    return _class;
  }

  // TODO: replace with Package this.createQuantity(?name,?base)
  static createQuantity(name: string): IClass {
    return this.createClass(name, ClassStereotype.QUANTITY, [OntologicalNature.quantity]);
  }

  // TODO: replace with Package this.createRelator(?name,?base)
  static createRelator(name: string): IClass {
    return this.createClass(name, ClassStereotype.RELATOR, [OntologicalNature.relator]);
  }

  // TODO: replace with Package this.createMode(?name,?base)
  static createMode(name: string): IClass {
    return this.createClass(name, ClassStereotype.MODE, [OntologicalNature.intrinsic_mode]);
  }

  // TODO: replace with Package this.createQuality(?name,?base)
  static createQuality(name: string): IClass {
    return this.createClass(name, ClassStereotype.QUALITY, [OntologicalNature.quality]);
  }

  // TODO: replace with Package this.createSubkind(?name,?nature=functional-complex,?base)
  static createSubkind(name: string): IClass {
    return this.createClass(name, ClassStereotype.SUBKIND, [OntologicalNature.functional_complex]);
  }

  // TODO: replace with Package this.createPhase(?name,?nature=functional-complex,?base)
  static createPhase(name: string): IClass {
    return this.createClass(name, ClassStereotype.PHASE, [OntologicalNature.functional_complex]);
  }

  // TODO: replace with Package this.createRole(?name,?nature=functional-complex,?base)
  static createRole(name: string): IClass {
    return this.createClass(name, ClassStereotype.ROLE, [OntologicalNature.functional_complex]);
  }

  // TODO: replace with Package this.createCategory(?name,?nature=functional-complex,?base)
  static createCategory(name: string): IClass {
    return this.createClass(name, ClassStereotype.CATEGORY, [OntologicalNature.functional_complex]);
  }

  // TODO: replace with Package this.createMixin(?name,?nature=functional-complex,?base)
  static createMixin(name: string): IClass {
    return this.createClass(name, ClassStereotype.MIXIN, [OntologicalNature.functional_complex]);
  }

  // TODO: replace with Package this.createRoleMixin(?name,?nature=functional-complex,?base)
  static createRoleMixin(name: string): IClass {
    return this.createClass(name, ClassStereotype.ROLE_MIXIN, [OntologicalNature.functional_complex]);
  }

  // TODO: replace with Package this.createPhaseMixin(?name,?nature=functional-complex,?base)
  static createPhaseMixin(name: string): IClass {
    return this.createClass(name, ClassStereotype.PHASE_MIXIN, [OntologicalNature.functional_complex]);
  }

  // TODO: replace with Package this.createSituation(?name,?base)
  static createSituation(name: string): IClass {
    return this.createClass(name, ClassStereotype.SITUATION, [OntologicalNature.situation]);
  }

  // TODO: replace with Package this.createEvent(?name,?base)
  static createEvent(name: string): IClass {
    return this.createClass(name, ClassStereotype.EVENT, [OntologicalNature.event]);
  }

  // TODO: replace with Package this.createAbstract(?name,?base)
  static createAbstract(name: string): IClass {
    return this.createClass(name, ClassStereotype.ABSTRACT, [OntologicalNature.abstract]);
  }

  // TODO: replace with Package this.createType(?name,?base)
  static createType(name: string): IClass {
    return this.createClass(name, ClassStereotype.TYPE, [OntologicalNature.type]);
  }

  // TODO: replace with Package this.createDatatype(?name,?base)
  static createDatatype(name: string): IClass {
    return this.createClass(name, ClassStereotype.DATATYPE, [OntologicalNature.abstract]);
  }

  // TODO: replace with Package this.createEnumeration(?name,?literalsBases,?base)
  static createEnumeration(name: string, literals: string[]): IClass {
    let enumeration = this.createClass(name, ClassStereotype.ENUMERATION, [OntologicalNature.abstract]);
    enumeration.literals = literals.map(literal => this.createLiteral(literal));
    return enumeration;
  }

  // TODO: replace with Class this.createLiteral(?name,?base)
  static createLiteral(name: string): ILiteral {
    return {
      type: OntoumlType.LITERAL_TYPE,
      id: uniqid(),
      name: name,
      description: null,
      propertyAssignments: null
    };
  }

  // TODO: replace with Class this.createBinaryRelation(source,target,?name,?stereotype,?base)
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

  // TODO: replace with Class this.createMediationRelation(source,target,?name,?base)
  static createMediation(name: string, relator: IClass, mediated: IClass, shouldResolveReferences: boolean = false): IRelation {
    const mediation = this.createRelation(name, RelationStereotype.MEDIATION, relator, mediated, shouldResolveReferences);
    mediation.properties[1].isReadOnly = true;
    mediation.properties[1].cardinality = '1';
    return mediation;
  }

  // TODO: replace with Class this.createMaterialRelation(source,target,?name,?base)
  static createMaterial(name: string, source: IClass, target: IClass, shouldResolveReferences: boolean = false): IRelation {
    const material = this.createRelation(name, RelationStereotype.MATERIAL, source, target, shouldResolveReferences);
    material.properties[0].cardinality = '1..*';
    material.properties[1].cardinality = '1..*';
    return material;
  }

  // TODO: replace with Class this.createCharacterizationRelation(source,target,?name,?base)
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
    // TODO: review code; adding plugin defaults characterization.properties[0].cardinality = '1';
    characterization.properties[1].isReadOnly = true;
    characterization.properties[1].cardinality = '1';
    return characterization;
  }

  // TODO: replace with Class this.createTerminationRelation(source,target,?name,?base)
  static createTermination(name: string, endurant: IClass, event: IClass, shouldResolveReferences: boolean = false): IRelation {
    const characterization = this.createRelation(name, RelationStereotype.TERMINATION, endurant, event, shouldResolveReferences);
    // TODO: review code; adding plugin defaults
    // characterization.properties[1].cardinality = '1';
    // characterization.properties[1].isReadOnly = true;
    // characterization.properties[0].cardinality = '1';
    characterization.properties[0].isReadOnly = true;
    return characterization;
  }

  // TODO: replace with Class this.createCreationRelation(source,target,?name,?base)
  static createCreation(name: string, endurant: IClass, event: IClass, shouldResolveReferences: boolean = false): IRelation {
    const characterization = this.createRelation(name, RelationStereotype.CREATION, endurant, event, shouldResolveReferences);
    // TODO: review code; adding plugin defaults
    // characterization.properties[1].cardinality = '1';
    // characterization.properties[0].cardinality = '1';
    characterization.properties[0].isReadOnly = true;
    characterization.properties[1].isReadOnly = true;
    return characterization;
  }

  // TODO: replace with Class this.createPartWholeRelation(source,target,?name,?base)
  static createPartWhole(name: string, source: IClassifier, target: IClassifier) {
    const relation: IRelation = this.createRelation(name, null, source, target);

    relation.properties[1].aggregationKind = AggregationKind.COMPOSITE;
    return relation;
  }

  // TODO: replace with Class this.createAttribute(propertyType,?name,?base)
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

  // TODO: replace with Class this.createAttribute(propertyType,?name,?base)
  static addAttribute(owner: IClass, name: string, type?: IClass): IProperty {
    const attr = this.createProperty(name, type);

    if (!owner.properties) owner.properties = [];

    owner.properties.push(attr);
    return attr;
  }

  // TODO: Replace with Package this.createGeneralization(general,specific,?name,?base)
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

  // TODO: Replace with Package this.createGeneralizationSet(generalizations,?isDisjoint,?isComplete,?name,?base)
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

  // TODO: Replace with Package this.createPartition(generalizations,?name,?base)
  static createPartition(name: string, generalizations: IGeneralization[]): IGeneralizationSet {
    return this.createGeneralizationSet(name, generalizations, true, true);
  }

  // TODO: Replace with Package this.createPackage(?name,?base) or Project this.createProject
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
