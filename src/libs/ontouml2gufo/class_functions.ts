import { Class, ClassStereotype, OntologicalNature, OntoumlType } from '@libs/ontouml';
import { Ontouml2Gufo, transformAnnotations, getUriFromXsdMapping } from './';

const N3 = require('n3');
const { namedNode, literal } = N3.DataFactory;

export function transformClass(transformer: Ontouml2Gufo, _class: Class): boolean {
  const { uriManager } = transformer;
  if (uriManager.getUriFromTaggedValues(_class) || getUriFromXsdMapping(_class) || _class.isPrimitiveDatatype()) {
    return true;
  }

  transformClassAsIndividual(transformer, _class);
  transformClassAsClass(transformer, _class);

  if (_class.hasEnumerationStereotype()) {
    transformEnumeration(transformer, _class);
  }

  transformAnnotations(transformer, _class);

  return true;
}

export function transformClassAsIndividual(transformer: Ontouml2Gufo, _class: Class): boolean {
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

  const classTypeUri = classTypeMap[_class.stereotype];

  if (!classTypeUri) return false;

  const classUri = transformer.getUri(_class);
  transformer.addQuad(classUri, 'rdf:type', 'owl:Class');
  transformer.addQuad(classUri, 'rdf:type', classTypeUri);

  return true;
}

export function transformClassAsClass(transformer: Ontouml2Gufo, classElement: Class) {
  const classUri = transformer.getUri(classElement);
  transformer.addQuad(classUri, 'rdf:type', 'owl:NamedIndividual');

  // Add subClassOf from allowed nature
  const parentSettings = getGufoParents(classElement);
  if (parentSettings && parentSettings.parentUri) {
    transformer.addQuad(classUri, 'rdfs:subClassOf', parentSettings.parentUri);
  }

  if (parentSettings && parentSettings.unionOf && parentSettings.unionOf.length > 1) {
    transformer.addQuad(
      namedNode(classUri),
      namedNode('rdfs:subClassOf'),
      transformer.writer.blank([
        {
          predicate: namedNode('rdf:type'),
          object: namedNode('owl:Class')
        },
        {
          predicate: namedNode('owl:unionOf'),
          object: transformer.writer.list(parentSettings.unionOf.map(parentUri => namedNode(parentUri)))
        }
      ])
    );
  }
}

export function transformEnumeration(transformer: Ontouml2Gufo, classElement: Class) {
  const { literals } = classElement;

  if (!literals) {
    return;
  }

  const uri = transformer.getUri(classElement);
  const literalUris = literals.map(literal => namedNode(transformer.getUri(literal)));

  transformer.addQuad(
    namedNode(uri),
    namedNode('owl:equivalentClass'),
    transformer.writer.blank([
      {
        predicate: namedNode('rdf:type'),
        object: namedNode('owl:Class')
      },
      {
        predicate: namedNode('owl:oneOf'),
        object: transformer.writer.list(literalUris)
      }
    ])
  );

  for (let i = 0; i < literalUris.length; i += 1) {
    const literalUri = literalUris[i];

    transformer.addQuad(literalUri, 'rdf:type', uri);
    transformer.addQuad(literalUri, 'rdf:label', literal(literals[i].name));
  }
}

export function getCollectiveGufoParent(classElement: Class): string {
  if (classElement.isExtensional === null) return 'gufo:Collection';
  if (classElement.isExtensional) return 'gufo:FixedCollection';
  return 'gufo:VariableCollection';
}

export function getGufoParentFromAllowed(classElement: Class): GufoParentSettings {
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

  const restrictedTo = classElement.restrictedTo;

  if (!restrictedTo || restrictedTo.length === 0) return null;

  // Allows a single ontological nature
  if (restrictedTo.length === 1) {
    const nature = restrictedTo[0];

    if (nature === OntologicalNature.collective) return { parentUri: getCollectiveGufoParent(classElement), unionOf: null };
    if (nature === OntologicalNature.abstract) {
      switch (classElement.stereotype) {
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
  if (restrictedTo.includes(OntologicalNature.type)) return { parentUri: 'owl:Thing', unionOf: null };

  if (restrictedTo.includes(OntologicalNature.abstract)) return { parentUri: 'gufo:Individual', unionOf: null };

  if (restrictedTo.includes(OntologicalNature.event)) return { parentUri: 'gufo:ConcreteIndividual', unionOf: null };

  if (
    !restrictedTo.includes(OntologicalNature.quality) &&
    !restrictedTo.includes(OntologicalNature.intrinsic_mode) &&
    !restrictedTo.includes(OntologicalNature.extrinsic_mode) &&
    !restrictedTo.includes(OntologicalNature.relator)
  )
    return { parentUri: 'gufo:Object', unionOf: null };

  if (
    !restrictedTo.includes(OntologicalNature.collective) &&
    !restrictedTo.includes(OntologicalNature.functional_complex) &&
    !restrictedTo.includes(OntologicalNature.quantity)
  ) {
    if (!restrictedTo.includes(OntologicalNature.relator) && !restrictedTo.includes(OntologicalNature.extrinsic_mode))
      return { parentUri: 'gufo:IntrinsicAspect', unionOf: null };

    if (!restrictedTo.includes(OntologicalNature.quality) && !restrictedTo.includes(OntologicalNature.intrinsic_mode))
      return { parentUri: 'gufo:ExtrinsicAspect', unionOf: null };

    if (!restrictedTo.includes(OntologicalNature.quality) && !restrictedTo.includes(OntologicalNature.relator))
      return { parentUri: 'gufo:Aspect', unionOf: ['gufo:IntrinsicMode', 'gufo:ExtrinsicMode'] };

    return { parentUri: 'gufo:Aspect', unionOf: null };
  }

  return { parentUri: 'gufo:Endurant', unionOf: null };
}

interface GufoParentSettings {
  parentUri: string;
  unionOf: string[];
}

export function getGufoParents(classElement: Class): GufoParentSettings {
  const parents = classElement.getParents() || [];
  const restrictedTo = classElement.restrictedTo || [];

  // If the class has no parents...
  if (parents.length === 0) return getGufoParentFromAllowed(classElement);

  // If the class has multiple parents, then we check the allowed nature of its parents
  let hasSameNatureAsAParent = false;
  for (let parent of parents) {
    if (parent.type !== OntoumlType.CLASS_TYPE) continue;

    const parentRestrictedTo = (parent as Class).restrictedTo || [];
    const containsAll = (source, target) => target.every(v => source.includes(v));

    if (containsAll(restrictedTo, parentRestrictedTo) && containsAll(parentRestrictedTo, restrictedTo)) {
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
export function writeDisjointnessAxioms(transformer: Ontouml2Gufo, classes: Class[]): boolean {
  const ultimateSortalStereotypes = [
    ClassStereotype.KIND,
    ClassStereotype.QUANTITY,
    ClassStereotype.COLLECTIVE,
    ClassStereotype.RELATOR,
    ClassStereotype.MODE,
    ClassStereotype.QUALITY
  ];

  for (let i = 0; i < ultimateSortalStereotypes.length; i += 1) {
    const ultimateSortalStereotype = ultimateSortalStereotypes[i];

    // TODO: replace with getClasses(stereotype), requires changing the input of the method
    const stereotypeClasses = classes
      .filter(({ stereotype }: Class) => stereotype && stereotype[0] === ultimateSortalStereotype)
      .map((classElement: Class) => {
        const uri = transformer.getUri(classElement);
        return namedNode(uri);
      });

    // Checks if there are at least 2 classes with the stereotype to avoid generating useless and potentially inconsistent expressions
    if (stereotypeClasses.length > 1) {
      transformer.addQuad(
        transformer.writer.blank(namedNode('rdf:type'), namedNode('owl:AllDisjointClasses')),
        namedNode('owl:members'),
        transformer.writer.list(stereotypeClasses)
      );
    }
  }

  return true;
}
