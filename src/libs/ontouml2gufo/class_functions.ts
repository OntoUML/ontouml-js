import { Quad, N3Writer } from 'n3';
import { IClass, ILiteral, IOntoUML2GUFOOptions } from '@types';
import { OntoUMLType, ClassStereotype, OntologicalNature } from '@constants/.';
import { getURI, hasAssignedUri } from './helper_functions';
import { transformAttributes } from './attribute_functions';
import { transformAnnotations } from './annotation_function';

const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode, quad, literal } = DataFactory;

/**
 * Transform classes by their stereotype
 */
export async function transformClassesByStereotype(
  writer: N3Writer,
  classes: IClass[],
  options: IOntoUML2GUFOOptions,
): Promise<boolean> {
  for (const classElement of classes) {
    const { stereotypes, properties } = classElement;

    // TODO: Replace with hasValidStereotype()
    if (!stereotypes || stereotypes.length !== 1 || hasAssignedUri(classElement)) continue;

    const uri = getURI({ element: classElement, options });
    const stereotype = stereotypes[0];

    // TODO: replace with isPrimitiveDatatype()
    const isPrimitiveDatatype = stereotype === ClassStereotype.DATATYPE && !properties;

    if (!isPrimitiveDatatype) {
      await writer.addQuads([
        quad(namedNode(uri), namedNode('rdf:type'), namedNode('owl:Class')),
        quad(namedNode(uri), namedNode('rdf:type'), namedNode('owl:NamedIndividual')),
      ]);
    }

    // Get quads from class stereotype function
    const classTypeQuad = transformClassType(classElement, options);
    if (classTypeQuad) {
      await writer.addQuad(classTypeQuad);
    }

    // TODO: Replace with isEnumeration()
    const isEnumeration = stereotype === ClassStereotype.ENUMERATION;
    if (isEnumeration) {
      await writer.addQuads(transformEnumeration(classElement, options, writer));
    }

    // Add subClassOf for all parents
    const parents = classElement.getParents();
    if (parents) {
      for (let i = 0; i < parents.length; i += 1) {
        const parentUri = getURI({ element: parents[i], options });

        await writer.addQuad(namedNode(uri), namedNode('rdfs:subClassOf'), namedNode(parentUri));
      }
    }

    // Add subClassOf from allowed nature
    const parentSettings = getGufoParents(classElement);
    if (parentSettings && parentSettings.parentUri) {
      await writer.addQuad(namedNode(uri), namedNode('rdfs:subClassOf'), namedNode(parentSettings.parentUri));
    }

    if (parentSettings && parentSettings.unionOf && parentSettings.unionOf.length > 1) {
      await writer.addQuad(
        namedNode(uri),
        namedNode('rdfs:subClassOf'),
        writer.blank([
          {
            predicate: namedNode('rdf:type'),
            object: namedNode('owl:Class'),
          },
          {
            predicate: namedNode('owl:unionOf'),
            object: writer.list(parentSettings.unionOf.map(parentUri => namedNode(parentUri))),
          },
        ]),
      );
    }

    // transform class attributes
    if (classElement.properties) {
      await transformAttributes(writer, classElement, options);
    }

    // transform annotations
    await transformAnnotations(writer, classElement, options);
  }

  return true;
}

function transformClassType(_class: IClass, options: IOntoUML2GUFOOptions): Quad {
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
    [ClassStereotype.DATATYPE]: 'gufo:AbstractIndividualType',
    [ClassStereotype.ENUMERATION]: 'gufo:AbstractIndividualType',
  };

  const uri = getURI({ element: _class, options });
  const stereotype = _class.stereotypes[0];
  const classType = classTypeMap[stereotype];

  if (!classType) return null;

  return quad(namedNode(uri), namedNode('rdf:type'), namedNode(classType));
}

export function transformEnumeration(
  classElement: IClass,
  options: IOntoUML2GUFOOptions,
  writer?: N3Writer,
): Quad[] {
  const { literals } = classElement;

  if (!literals) {
    return [];
  }

  const uri = getURI({ element: classElement, options });
  const literalUris = literals.map((literal: ILiteral) =>
    namedNode(
      getURI({
        element: literal,
        options,
      }),
    ),
  );

  const quads = [
    quad(
      namedNode(uri),
      namedNode('owl:equivalentClass'),
      writer.blank([
        {
          predicate: namedNode('rdf:type'),
          object: namedNode('owl:Class'),
        },
        {
          predicate: namedNode('owl:oneOf'),
          object: writer.list(literalUris),
        },
      ]),
    ),
  ];

  for (let i = 0; i < literalUris.length; i += 1) {
    const literalUri = literalUris[i];

    quads.push(quad(literalUri, namedNode('rdf:type'), namedNode(uri)));
    quads.push(quad(literalUri, namedNode('rdf:label'), literal(literals[i].name)));
  }

  return quads;
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
    type: 'gufo:ConcreteIndividualType',
  };

  const allowed = classElement.allowed;

  if (!allowed || allowed.length === 0) return null;

  // Allows a single ontological nature
  if (allowed.length === 1) {
    const nature = allowed[0];

    if (nature === OntologicalNature.collective)
      return { parentUri: getCollectiveGufoParent(classElement), unionOf: null };

    return { parentUri: basicMapping[nature], unionOf: null };
  }

  // Allows multiple ontological natures
  if (allowed.includes(OntologicalNature.type)) return { parentUri: 'owl:Thing', unionOf: null };

  if (allowed.includes(OntologicalNature.abstract)) return { parentUri: 'gufo:Individual', unionOf: null };

  if (allowed.includes(OntologicalNature.event))
    return { parentUri: 'gufo:ConcreteIndividual', unionOf: null };

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
    if (parent.type !== OntoUMLType.CLASS_TYPE) continue;

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
export async function createDisjointnessContraints(
  writer: N3Writer,
  classes: IClass[],
  options: IOntoUML2GUFOOptions,
): Promise<boolean> {
  const ultimateSortalStereotypes = [
    ClassStereotype.KIND,
    ClassStereotype.QUANTITY,
    ClassStereotype.COLLECTIVE,
    ClassStereotype.RELATOR,
    ClassStereotype.MODE,
    ClassStereotype.QUALITY,
  ];

  for (let i = 0; i < ultimateSortalStereotypes.length; i += 1) {
    const stereotype = ultimateSortalStereotypes[i];

    // TODO: replace with getClasses(stereotype), requires changing the input of the method
    const stereotypeClasses = classes
      .filter(({ stereotypes }: IClass) => stereotypes && stereotypes[0] === stereotype)
      .map((classElement: IClass) => {
        const uri = getURI({ element: classElement, options });
        return namedNode(uri);
      });

    // Checks if there are at least 2 classes with the stereotype to avoid generating useless and potentially inconsistent expressions
    if (stereotypeClasses.length > 1) {
      await writer.addQuad(
        writer.blank(namedNode('rdf:type'), namedNode('owl:AllDisjointClasses')),
        namedNode('owl:members'),
        writer.list(stereotypeClasses),
      );
    }
  }

  return true;
}
