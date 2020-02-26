import { N3Writer } from 'n3';
import { IClass } from '@types';
import { ClassStereotype } from '@constants/.';
import {
  transformKind,
  transformQuantity,
  transformCollective,
  transformSubkind,
  transformRole,
  transformPhase,
  transformCategory,
  transformMixin,
  transformRoleMixin,
  transformPhaseMixin,
  transformRelator,
  transformMode,
  transformQuality,
  transformEvent,
} from './class_stereotype_functions';

const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode, literal, quad } = DataFactory;

/**
 * Transform classes of same stereotype using owl:AllDisjointClasses
 */
export async function transformDisjointClasses(
  writer: N3Writer,
  classes: IClass[],
): Promise<boolean> {
  const disjointStereotypes = [
    ClassStereotype.KIND,
    ClassStereotype.QUANTITY,
    ClassStereotype.COLLECTIVE,
    ClassStereotype.RELATOR,
    ClassStereotype.MODE,
    ClassStereotype.QUALITY,
  ];

  for (let i = 0; i < disjointStereotypes.length; i += 1) {
    const stereotype = disjointStereotypes[i];
    const stereotypeClasses = classes
      .filter(({ stereotypes }: IClass) => stereotypes!==null && stereotypes[0]===stereotype)
      .map(({ id }: IClass) => namedNode(`:${id}`));

    // check if has at least 2 classes to avoid insconsistence
    if (stereotypeClasses.length > 1) {
      await writer.addQuad(
        writer.blank(
          namedNode('rdf:type'),
          namedNode('owl:AllDisjointClasses'),
        ),
        namedNode('owl:members'),
        writer.list(stereotypeClasses),
      );
    }
  }

  return true;
}

/**
 * Transform classes by its stereotypes
 */
export async function transformClassesByStereotype(
  writer: N3Writer,
  classes: IClass[],
): Promise<boolean> {
  const transformStereotypeFunction = {
    [ClassStereotype.KIND]: transformKind,
    [ClassStereotype.QUANTITY]: transformQuantity,
    [ClassStereotype.COLLECTIVE]: transformCollective,
    [ClassStereotype.SUBKIND]: transformSubkind,
    [ClassStereotype.ROLE]: transformRole,
    [ClassStereotype.PHASE]: transformPhase,
    [ClassStereotype.CATEGORY]: transformCategory,
    [ClassStereotype.MIXIN]: transformMixin,
    [ClassStereotype.ROLE_MIXIN]: transformRoleMixin,
    [ClassStereotype.PHASE_MIXIN]: transformPhaseMixin,
    [ClassStereotype.RELATOR]: transformRelator,
    [ClassStereotype.MODE]: transformMode,
    [ClassStereotype.QUALITY]: transformQuality,
    [ClassStereotype.EVENT]: transformEvent,
  };

  for (let i = 0; i < classes.length; i += 1) {
    const classElement = classes[i];
    const { id, name, stereotypes } = classElement;

    if(!stereotypes || stereotypes.length!==1)
      continue;
    
    const stereotype = stereotypes[0];
    const parents = classElement.getParents();

    if (
      stereotype &&
      Object.keys(transformStereotypeFunction).includes(stereotype)
    ) {
      await writer.addQuads([
        quad(
          namedNode(`:${id}`),
          namedNode('rdf:type'),
          namedNode('owl:Class'),
        ),
        quad(
          namedNode(`:${id}`),
          namedNode('rdf:type'),
          namedNode('owl:NamedIndividual'),
        ),
        quad(namedNode(`:${id}`), namedNode('rdfs:label'), literal(name)),
      ]);

      // Add subClassOf for all parents
      if (parents) {
        for (let i = 0; i < parents.length; i += 1) {
          await writer.addQuad(
            namedNode(`:${id}`),
            namedNode('rdfs:subClassOf'),
            namedNode(`:${parents[i].id}`),
          );
        }
      }

      // Get quads from class stereotype function
      const quads = transformStereotypeFunction[stereotype](classElement);

      await writer.addQuads(quads);
    }
  }

  return true;
}
