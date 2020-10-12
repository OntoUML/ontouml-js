import { AggregationKind, ClassStereotype, OntologicalNature, OntoumlType, RelationStereotype } from '@constants/.';
import { ModelManager } from '@libs/model';
import { Ontouml2Gufo } from '@libs/ontouml2gufo';
import uniqid from 'uniqid';

import { IPackage, IClass, IRelation, IProperty, IGeneralization, IGeneralizationSet, IElement, ILiteral } from '@types';
import Options from '@libs/ontouml2gufo/options';
import Issue from '@libs/ontouml2gufo/issue';

export function generateGufo(model: IPackage, options?: Partial<Options>): string {
  const clonedModel = JSON.parse(JSON.stringify(model));
  const modelManager = new ModelManager(clonedModel);
  const ontouml2gufo = new Ontouml2Gufo(modelManager, {
    baseIri: 'https://example.com',
    format: 'N-Triple',
    ...options
  });

  ontouml2gufo.transform();

  return ontouml2gufo.getOwlCode();
}

export function getIssues(model: IPackage, options?: Partial<Options>): Issue[] {
  const clonedModel = JSON.parse(JSON.stringify(model));
  const modelManager = new ModelManager(clonedModel);
  const ontouml2gufo = new Ontouml2Gufo(modelManager, {
    baseIri: 'https://example.com',
    format: 'Turtle',
    ...options
  });

  ontouml2gufo.transform();

  return ontouml2gufo.getIssues();
}

export function createClass(name: string, stereotype: ClassStereotype, nature: OntologicalNature[]): IClass {
  return {
    type: OntoumlType.CLASS_TYPE,
    id: uniqid(),
    name: name,
    description: null,
    properties: null,
    literals: null,
    propertyAssignments: null,
    stereotypes: [stereotype],
    isAbstract: false,
    isDerived: false,
    allowed: [...nature],
    isExtensional: null,
    isPowertype: null,
    order: null
  };
}

export function cloneClass(base: Partial<IClass>): IClass {
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

export function createKind(name: string): IClass {
  return createClass(name, ClassStereotype.KIND, [OntologicalNature.functional_complex]);
}

export function cloneKind(base: Partial<IClass>): IClass {
  base.stereotypes = [ClassStereotype.KIND];
  base.allowed = [OntologicalNature.functional_complex];
  return cloneClass(base);
}

export function createCollective(name: string): IClass {
  let _class = createClass(name, ClassStereotype.COLLECTIVE, [OntologicalNature.collective]);
  _class.isExtensional = false;
  return _class;
}

export function createQuantity(name: string): IClass {
  return createClass(name, ClassStereotype.QUANTITY, [OntologicalNature.quantity]);
}

export function createRelator(name: string): IClass {
  return createClass(name, ClassStereotype.RELATOR, [OntologicalNature.relator]);
}

export function createMode(name: string): IClass {
  return createClass(name, ClassStereotype.MODE, [OntologicalNature.intrinsic_mode]);
}

export function createQuality(name: string): IClass {
  return createClass(name, ClassStereotype.QUALITY, [OntologicalNature.quality]);
}

export function createSubkind(name: string): IClass {
  return createClass(name, ClassStereotype.SUBKIND, [OntologicalNature.functional_complex]);
}

export function createPhase(name: string): IClass {
  return createClass(name, ClassStereotype.PHASE, [OntologicalNature.functional_complex]);
}

export function createRole(name: string): IClass {
  return createClass(name, ClassStereotype.ROLE, [OntologicalNature.functional_complex]);
}

export function createCategory(name: string): IClass {
  return createClass(name, ClassStereotype.CATEGORY, [OntologicalNature.functional_complex]);
}

export function createMixin(name: string): IClass {
  return createClass(name, ClassStereotype.MIXIN, [OntologicalNature.functional_complex]);
}

export function createRoleMixin(name: string): IClass {
  return createClass(name, ClassStereotype.ROLE_MIXIN, [OntologicalNature.functional_complex]);
}

export function createPhaseMixin(name: string): IClass {
  return createClass(name, ClassStereotype.PHASE_MIXIN, [OntologicalNature.functional_complex]);
}

export function createSituation(name: string): IClass {
  return createClass(name, ClassStereotype.SITUATION, [OntologicalNature.situation]);
}

export function createEvent(name: string): IClass {
  return createClass(name, ClassStereotype.EVENT, [OntologicalNature.event]);
}

export function createAbstract(name: string): IClass {
  return createClass(name, ClassStereotype.ABSTRACT, [OntologicalNature.abstract]);
}

export function createType(name: string): IClass {
  return createClass(name, ClassStereotype.TYPE, [OntologicalNature.type]);
}

export function createDatatype(name: string): IClass {
  return createClass(name, ClassStereotype.DATATYPE, [OntologicalNature.abstract]);
}

export function createEnumeration(name: string, literals: string[]): IClass {
  let enumeration = createClass(name, ClassStereotype.ENUMERATION, [OntologicalNature.abstract]);
  enumeration.literals = literals.map(literal => createLiteral(literal));
  return enumeration;
}

export function createLiteral(name: string): ILiteral {
  return {
    type: OntoumlType.LITERAL_TYPE,
    id: uniqid(),
    name: name,
    description: null,
    propertyAssignments: null
  };
}

export function createRelation(name: string, stereotype: RelationStereotype, source: IClass, target: IClass): IRelation {
  return {
    type: OntoumlType.RELATION_TYPE,
    id: uniqid(),
    name: name,
    description: null,
    properties: [createProperty(null, source), createProperty(null, target)],
    propertyAssignments: null,
    stereotypes: [stereotype],
    isAbstract: false,
    isDerived: false
  };
}

export function createProperty(name: string, type?: IClass): IProperty {
  return {
    type: OntoumlType.PROPERTY_TYPE,
    id: uniqid(),
    name: name,
    description: null,
    propertyType: type
      ? {
          type: OntoumlType.CLASS_TYPE,
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

export function addAttribute(owner: IClass, name: string, type?: IClass): IProperty {
  const attr = createProperty(name, type);

  if (!owner.properties) owner.properties = [];

  owner.properties.push(attr);
  return attr;
}

export function createGeneralization(specific: IClass, general: IClass): IGeneralization {
  return {
    type: OntoumlType.GENERALIZATION_TYPE,
    id: uniqid(),
    name: null,
    description: null,
    propertyAssignments: null,
    general: {
      type: OntoumlType.CLASS_TYPE,
      id: general.id
    },
    specific: {
      type: OntoumlType.CLASS_TYPE,
      id: specific.id
    }
  };
}

export function createGeneralizationSet(
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
export function createPartition(name: string, generalizations: IGeneralization[]): IGeneralizationSet {
  return createGeneralizationSet(name, generalizations, true, true);
}

export function createPackage(name: string, contents: IElement[]): IPackage {
  return {
    type: OntoumlType.PACKAGE_TYPE,
    id: uniqid(),
    name: name,
    description: null,
    contents: [...contents],
    propertyAssignments: null
  };
}

export const OntoumlFactory = {
  addAttribute,
  cloneClass,
  cloneKind,
  createAbstract,
  createCategory,
  createClass,
  createCollective,
  createDatatype,
  createEnumeration,
  createEvent,
  createGeneralization,
  createGeneralizationSet,
  createKind,
  createLiteral,
  createMixin,
  createMode,
  createPackage,
  createPartition,
  createPhase,
  createPhaseMixin,
  createProperty,
  createQuality,
  createQuantity,
  createRelation,
  createRelator,
  createRole,
  createRoleMixin,
  createSituation,
  createSubkind,
  createType
};
