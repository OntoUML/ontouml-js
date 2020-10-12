import { Writer } from 'n3';
import { IClass } from '@types';
import { OntoumlType, ClassStereotype, OntologicalNature } from '@constants/.';
import { getUri, hasAssignedUri } from './uri_manager';
import { transformAnnotations } from './annotation_function';
import Options from './options';
import { isPrimitiveDatatype, isEnumeration, getStereotype } from './helper_functions';

const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode, quad, literal } = DataFactory;

export function transformClass(writer: Writer, classElement: IClass, options: Options): boolean {
  if (hasAssignedUri(classElement) || isPrimitiveDatatype(classElement)) {
    return true;
  }

  transformClassAsIndividual(writer, classElement, options);
  transformClassAsClass(writer, classElement, options);

  if (isEnumeration(classElement)) {
    transformEnumeration(writer, classElement, options);
  }

  transformAnnotations(writer, classElement, options);

  return true;
}

export function transformClassAsIndividual(writer: Writer, _class: IClass, options: Options): boolean {
  const classTypeMap = {
    [ClassStereotype.KIND]: 'gufo:Kind',
    [ClassStereotype.QUANTITY]: 'gufo:Kind',
    [ClassStereotype.COLLECTIVE]: 'gufo:Kind',
    [ClassStereotype.RELATOR]: 'gufo:Kind',
    [ClassStereotype.MODE]: 'gufo:Kind',
    [ClassStereotype.QUALITY]: 'gufo:Kind',
    [ClassStereotype.SUBKIND]: 'gufo:SubKind',
    [ClassStereotype.ROLE]: 'gufo:Role',
    [ClassStereotype.HISTORICAL_ROLE]: 'gufo:Role',
    [ClassStereotype.HISTORICAL_ROLE_MIXIN]: 'gufo:Role',
    [ClassStereotype.PHASE]: 'gufo:Phase',
    [ClassStereotype.CATEGORY]: 'gufo:Category',
    [ClassStereotype.MIXIN]: 'gufo:Mixin',
    [ClassStereotype.ROLE_MIXIN]: 'gufo:RoleMixin',
    [ClassStereotype.PHASE_MIXIN]: 'gufo:PhaseMixin',
    [ClassStereotype.EVENT]: 'gufo:EventType',
    [ClassStereotype.SITUATION]: 'gufo:SituationType',
    [ClassStereotype.TYPE]: null,
    [ClassStereotype.ABSTRACT]: 'gufo:AbstractIndividualType',
    [ClassStereotype.DATATYPE]: 'gufo:AbstractIndividualType',
    [ClassStereotype.ENUMERATION]: 'gufo:AbstractIndividualType'
  };

  const classType = classTypeMap[getStereotype(_class)];

  if (!classType) return false;

  const uri = getUri(_class, options);
  writer.addQuads([
    quad(namedNode(uri), namedNode('rdf:type'), namedNode('owl:Class')),
    quad(namedNode(uri), namedNode('rdf:type'), namedNode(classType))
  ]);

  return true;
}

export function transformClassAsClass(writer: Writer, classElement: IClass, options: Options) {
  const uri = getUri(classElement, options);

  writer.addQuad(quad(namedNode(uri), namedNode('rdf:type'), namedNode('owl:NamedIndividual')));

  // Add subClassOf from allowed nature
  const parentSettings = getGufoParents(classElement);
  if (parentSettings && parentSettings.parentUri) {
    writer.addQuad(namedNode(uri), namedNode('rdfs:subClassOf'), namedNode(parentSettings.parentUri));
  }

  if (parentSettings && parentSettings.unionOf && parentSettings.unionOf.length > 1) {
    writer.addQuad(
      namedNode(uri),
      namedNode('rdfs:subClassOf'),
      writer.blank([
        {
          predicate: namedNode('rdf:type'),
          object: namedNode('owl:Class')
        },
        {
          predicate: namedNode('owl:unionOf'),
          object: writer.list(parentSettings.unionOf.map(parentUri => namedNode(parentUri)))
        }
      ])
    );
  }
}

export function transformEnumeration(writer: Writer, classElement: IClass, options: Options) {
  const { literals } = classElement;

  if (!literals) {
    return;
  }

  const uri = getUri(classElement, options);
  const literalUris = literals.map(literal => namedNode(getUri(literal, options)));

  writer.addQuad(
    quad(
      namedNode(uri),
      namedNode('owl:equivalentClass'),
      writer.blank([
        {
          predicate: namedNode('rdf:type'),
          object: namedNode('owl:Class')
        },
        {
          predicate: namedNode('owl:oneOf'),
          object: writer.list(literalUris)
        }
      ])
    )
  );

  for (let i = 0; i < literalUris.length; i += 1) {
    const literalUri = literalUris[i];

    writer.addQuad(quad(literalUri, namedNode('rdf:type'), namedNode(uri)));
    writer.addQuad(quad(literalUri, namedNode('rdf:label'), literal(literals[i].name)));
  }
}

export function getCollectiveGufoParent(classElement: IClass): string {
  if (classElement.isExtensional === null) return 'gufo:Collection';

  if (classElement.isExtensional) return 'gufo:FixedCollection';

  return 'gufo:VariableCollection';
}

export function getGufoParentFromAllowed(classElement: IClass): GufoParentSettings {
  const basicMapping = {
    abstract: 'gufo:QualityValue',
    collective: 'gufo:Collection',
    event: 'gufo:Event',
    situation: 'gufo:Situation',
    'functional-complex': 'gufo:FunctionalComplex',
    'intrinsic-mode': 'gufo:IntrinsicMode',
    'extrinsic-mode': 'gufo:ExtrinsicMode',
    quality: 'gufo:Quality',
    quantity: 'gufo:Quantity',
    relator: 'gufo:Relator',
    type: 'gufo:ConcreteIndividualType'
  };

  const allowed = classElement.allowed;

  if (!allowed || allowed.length === 0) return null;

  // Allows a single ontological nature
  if (allowed.length === 1) {
    const nature = allowed[0];

    if (nature === OntologicalNature.collective) return { parentUri: getCollectiveGufoParent(classElement), unionOf: null };
    if (nature === OntologicalNature.abstract) {
      switch (classElement.stereotypes[0]) {
        case ClassStereotype.DATATYPE:
        case ClassStereotype.ENUMERATION:
          return { parentUri: 'gufo:QualityValue', unionOf: null };
        case ClassStereotype.ABSTRACT:
        default:
          return { parentUri: 'gufo:AbstractIndividual', unionOf: null };
      }
    }

    return { parentUri: basicMapping[nature], unionOf: null };
  }

  // Allows multiple ontological natures
  if (allowed.includes(OntologicalNature.type)) return { parentUri: 'owl:Thing', unionOf: null };

  if (allowed.includes(OntologicalNature.abstract)) return { parentUri: 'gufo:Individual', unionOf: null };

  if (allowed.includes(OntologicalNature.event)) return { parentUri: 'gufo:ConcreteIndividual', unionOf: null };

  if (
    !allowed.includes(OntologicalNature.quality) &&
    !allowed.includes(OntologicalNature.intrinsic_mode) &&
    !allowed.includes(OntologicalNature.extrinsic_mode) &&
    !allowed.includes(OntologicalNature.relator)
  )
    return { parentUri: 'gufo:Object', unionOf: null };

  if (
    !allowed.includes(OntologicalNature.collective) &&
    !allowed.includes(OntologicalNature.functional_complex) &&
    !allowed.includes(OntologicalNature.quantity)
  ) {
    if (!allowed.includes(OntologicalNature.relator) && !allowed.includes(OntologicalNature.extrinsic_mode))
      return { parentUri: 'gufo:IntrinsicAspect', unionOf: null };

    if (!allowed.includes(OntologicalNature.quality) && !allowed.includes(OntologicalNature.intrinsic_mode))
      return { parentUri: 'gufo:ExtrinsicAspect', unionOf: null };

    if (!allowed.includes(OntologicalNature.quality) && !allowed.includes(OntologicalNature.relator))
      return { parentUri: 'gufo:Aspect', unionOf: ['gufo:IntrinsicMode', 'gufo:ExtrinsicMode'] };

    return { parentUri: 'gufo:Aspect', unionOf: null };
  }

  return { parentUri: 'gufo:Endurant', unionOf: null };
}

interface GufoParentSettings {
  parentUri: string;
  unionOf: string[];
}

export function getGufoParents(classElement: IClass): GufoParentSettings {
  const parents = classElement.getParents() || [];
  const allowed = classElement.allowed || [];

  // If the class has no parents...
  if (parents.length === 0) return getGufoParentFromAllowed(classElement);

  // If the class has multiple parents, then we check the allowed nature of its parents
  let hasSameNatureAsAParent = false;
  for (let parent of parents) {
    if (parent.type !== OntoumlType.CLASS_TYPE) continue;

    const parentAllowed = (parent as IClass).allowed || [];
    const containsAll = (source, target) => target.every(v => source.includes(v));

    if (containsAll(allowed, parentAllowed) && containsAll(parentAllowed, allowed)) {
      hasSameNatureAsAParent = true;
      break;
    }
  }

  // If the class has the same nature as its parents, there is no need to specialize a gufo element
  if (hasSameNatureAsAParent) return null;

  // Else, if no parent has the same nature as the class
  return getGufoParentFromAllowed(classElement);
}

/**
 * Transform classes of same stereotype using owl:AllDisjointClasses
 */
export function writeDisjointnessAxioms(writer: Writer, classes: IClass[], options: Options): boolean {
  const ultimateSortalStereotypes = [
    ClassStereotype.KIND,
    ClassStereotype.QUANTITY,
    ClassStereotype.COLLECTIVE,
    ClassStereotype.RELATOR,
    ClassStereotype.MODE,
    ClassStereotype.QUALITY
  ];

  for (let i = 0; i < ultimateSortalStereotypes.length; i += 1) {
    const stereotype = ultimateSortalStereotypes[i];

    // TODO: replace with getClasses(stereotype), requires changing the input of the method
    const stereotypeClasses = classes
      .filter(({ stereotypes }: IClass) => stereotypes && stereotypes[0] === stereotype)
      .map((classElement: IClass) => {
        const uri = getUri(classElement, options);
        return namedNode(uri);
      });

    // Checks if there are at least 2 classes with the stereotype to avoid generating useless and potentially inconsistent expressions
    if (stereotypeClasses.length > 1) {
      writer.addQuad(
        writer.blank(namedNode('rdf:type'), namedNode('owl:AllDisjointClasses')),
        namedNode('owl:members'),
        writer.list(stereotypeClasses)
      );
    }
  }

  return true;
}
