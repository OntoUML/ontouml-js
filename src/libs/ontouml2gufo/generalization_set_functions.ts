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

  const classParents = genSet.generalizations.map((gen: Generalization) => gen.getGeneralClass());
  const onlyClassParent = classParents.length === genSet.generalizations.length;
  const parent = genSet.getGeneralClass();
  const uniqueParent = !!parent;

  if (!uniqueParent || !onlyClassParent) {
    return;
  }

  if (genSet.isDisjoint) {
    const rigidOrAbstractChildren = genSet
      .getSpecificClasses()
      .filter((child: Class) => child.hasRigidStereotype() || (child.isRestrictedToAbstract() && !child.isPrimitiveDatatype()));

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
