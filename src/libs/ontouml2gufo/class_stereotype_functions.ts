import { Quad, N3Writer } from 'n3';
import { IClass, ILiteral, IOntoUML2GUFOOptions } from '@types';
import { getURI } from './helper_functions';

const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode, quad, literal } = DataFactory;

export function transformKind(
  classElement: IClass,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const uri = getURI({ element: classElement, options });

  return [
    // quad(
    //   namedNode(uri),
    //   namedNode('rdfs:subClassOf'),
    //   namedNode('gufo:FunctionalComplex'),
    // ),
    quad(namedNode(uri), namedNode('rdf:type'), namedNode('gufo:Kind')),
  ];
}

export function transformSubkind(
  classElement: IClass,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const uri = getURI({ element: classElement, options });

  return [
    quad(namedNode(uri), namedNode('rdf:type'), namedNode('gufo:SubKind')),
  ];
}

export function transformRole(
  classElement: IClass,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const uri = getURI({ element: classElement, options });

  return [quad(namedNode(uri), namedNode('rdf:type'), namedNode('gufo:Role'))];
}

export function transformHistoricalRole(
  classElement: IClass,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const uri = getURI({ element: classElement, options });

  return [quad(namedNode(uri), namedNode('rdf:type'), namedNode('gufo:Role'))];
}

export function transformPhase(
  classElement: IClass,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const uri = getURI({ element: classElement, options });

  return [quad(namedNode(uri), namedNode('rdf:type'), namedNode('gufo:Phase'))];
}

export function transformCategory(
  classElement: IClass,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const uri = getURI({ element: classElement, options });

  return [
    quad(namedNode(uri), namedNode('rdf:type'), namedNode('gufo:Category')),
  ];
}

export function transformMixin(
  classElement: IClass,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const uri = getURI({ element: classElement, options });

  return [quad(namedNode(uri), namedNode('rdf:type'), namedNode('gufo:Mixin'))];
}

export function transformRoleMixin(
  classElement: IClass,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const uri = getURI({ element: classElement, options });

  return [
    quad(namedNode(uri), namedNode('rdf:type'), namedNode('gufo:RoleMixin')),
  ];
}

export function transformPhaseMixin(
  classElement: IClass,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const uri = getURI({ element: classElement, options });

  return [
    quad(namedNode(uri), namedNode('rdf:type'), namedNode('gufo:PhaseMixin')),
  ];
}

export function transformRelator(
  classElement: IClass,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const uri = getURI({ element: classElement, options });

  return [
    // quad(
    //   namedNode(uri),
    //   namedNode('rdfs:subClassOf'),
    //   namedNode('gufo:Relator'),
    // ),
    quad(namedNode(uri), namedNode('rdf:type'), namedNode('gufo:Kind')),
  ];
}

export function transformMode(
  classElement: IClass,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const quads = [];
  const uri = getURI({ element: classElement, options });

  // const relations = classElement.getRelations();

  // const relationStereotypes = relations
  //   .filter((relation: IRelation) => relation.stereotypes !== null)
  //   .map((relation: IRelation) => relation.stereotypes[0]);

  // if (
  //   relationStereotypes.includes(RelationStereotype.CHARACTERIZATION) &&
  //   relationStereotypes.includes(RelationStereotype.EXTERNAL_DEPENDENCE)
  // ) {
  //   quads.push(
  //     quad(
  //       namedNode(uri),
  //       namedNode('rdfs:subClassOf'),
  //       namedNode('gufo:ExtrinsicMode'),
  //     ),
  //   );
  // } else {
  //   quads.push(
  //     quad(
  //       namedNode(uri),
  //       namedNode('rdfs:subClassOf'),
  //       namedNode('gufo:IntrinsicMode'),
  //     ),
  //   );
  // }

  quads.push(
    quad(namedNode(uri), namedNode('rdf:type'), namedNode('gufo:Kind')),
  );

  return quads;
}

export function transformQuality(
  classElement: IClass,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const uri = getURI({ element: classElement, options });

  return [
    // quad(
    //   namedNode(uri),
    //   namedNode('rdfs:subClassOf'),
    //   namedNode('gufo:Quality'),
    // ),
    quad(namedNode(uri), namedNode('rdf:type'), namedNode('gufo:Kind')),
  ];
}

export function transformQuantity(
  classElement: IClass,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const uri = getURI({ element: classElement, options });

  return [
    // quad(
    //   namedNode(uri),
    //   namedNode('rdfs:subClassOf'),
    //   namedNode('gufo:Quantity'),
    // ),
    quad(namedNode(uri), namedNode('rdf:type'), namedNode('gufo:Kind')),
  ];
}

export function transformCollective(
  classElement: IClass,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const uri = getURI({ element: classElement, options });

  return [
    // quad(
    //   namedNode(uri),
    //   namedNode('rdfs:subClassOf'),
    //   namedNode('gufo:Collection'),
    // ),
    quad(namedNode(uri), namedNode('rdf:type'), namedNode('gufo:Kind')),
  ];
}

export function transformEvent(
  classElement: IClass,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  getURI({ element: classElement, options });

  return [
    // quad(namedNode(uri), namedNode('rdfs:subClassOf'), namedNode('gufo:Event')),
  ];
}

export function transformType(
  classElement: IClass,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  getURI({ element: classElement, options });

  return [
    // quad(
    //   namedNode(uri),
    //   namedNode('rdfs:subClassOf'),
    //   namedNode('gufo:ConcreteIndividualType'),
    // ),
  ];
}

export function transformDatatype(
  classElement: IClass,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const { properties } = classElement;
  getURI({ element: classElement, options });
  const isComplexDatatype = !!properties;

  if (isComplexDatatype) {
    return [
      // quad(
      //   namedNode(uri),
      //   namedNode('rdfs:subClassOf'),
      //   namedNode('gufo:QualityValue'),
      // ),
    ];
  }

  return [];
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
    // quad(
    //   namedNode(uri),
    //   namedNode('rdfs:subClassOf'),
    //   namedNode('gufo:QualityValue'),
    // ),
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
    quads.push(
      quad(literalUri, namedNode('rdf:label'), literal(literals[i].name)),
    );
  }

  return quads;
}
