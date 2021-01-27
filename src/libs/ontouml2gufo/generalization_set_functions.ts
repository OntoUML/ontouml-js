// import { IClass, IGeneralization, IGeneralizationSet } from '@types';
// import { OntoumlType } from '@constants/.';

// import Ontouml2Gufo from './ontouml2gufo';
// import { isAbstract, isPrimitiveDatatype, isRigid } from './helper_functions';

import _ from 'lodash';
import { Generalization, GeneralizationSet, OntoumlType, Class } from '@libs/ontouml';
import { Ontouml2Gufo } from './';

const N3 = require('n3');
const { namedNode } = N3.DataFactory;

export const transformGeneralizationSet = (transformer: Ontouml2Gufo, genSet: GeneralizationSet) => {
  if (!genSet.generalizations || genSet.generalizations.length === 0 || (!genSet.isComplete && !genSet.isDisjoint)) return;

  const classChildren = (genSet.generalizations as Generalization[])
    .map(gen => gen.specific)
    .filter(child => child.type === OntoumlType.CLASS_TYPE);
  const onlyClassChildren = classChildren.length === genSet.generalizations.length;

  if (!onlyClassChildren) return;

  const classParents = (genSet.generalizations as Generalization[])
    .map(gen => gen.general)
    .filter(parent => parent.type === OntoumlType.CLASS_TYPE);
  const onlyClassParent = classParents.length === genSet.generalizations.length;

  const uniqueParent = _.uniq(classParents).length === 1;

  if (!uniqueParent || !onlyClassParent) return;

  const parent = classParents[0] as Class;

  if (genSet.isDisjoint) {
    const rigidOrAbstractChildren = (classChildren as Class[]).filter(
      child => child.hasRigidStereotype() || (child.isAbstract && !child.isPrimitiveDatatype())
    );

    if (rigidOrAbstractChildren.length > 1) {
      const childrenNodes = rigidOrAbstractChildren.map(_class => namedNode(transformer.getUri(_class)));
      transformer.addQuad(
        transformer.writer.blank(namedNode('rdf:type'), namedNode('owl:AllDisjointClasses')),
        namedNode('owl:members'),
        transformer.writer.list(childrenNodes)
      );
    }
  }

  if (genSet.isComplete && classChildren.length > 1) {
    const parentUri = transformer.getUri(parent);
    const childrenNodes = classChildren.map(_class => namedNode(transformer.getUri(_class)));

    transformer.addQuad(
      namedNode(parentUri),
      namedNode('owl:equivalentClass'),
      transformer.writer.blank([
        {
          predicate: namedNode('rdf:type'),
          object: namedNode('owl:Class')
        },
        {
          predicate: namedNode('owl:unionOf'),
          object: transformer.writer.list(childrenNodes)
        }
      ])
    );
  }
};
