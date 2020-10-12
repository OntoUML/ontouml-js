import { Writer } from 'n3';
import _ from 'lodash';
import { OntoumlType } from '@constants/.';
import { IClass, IGeneralization, IGeneralizationSet } from '@types';
import { isAbstract, isPrimitiveDatatype, isRigid } from './helper_functions';
import Options from './options';
import { getUri } from './uri_manager';

const N3 = require('n3');
const { namedNode } = N3.DataFactory;

export const transformGeneralizationSet = (writer: Writer, genSet: IGeneralizationSet, options: Options) => {
  if (!genSet.generalizations || genSet.generalizations.length === 0 || (!genSet.isComplete && !genSet.isDisjoint)) return;

  const classChildren = (genSet.generalizations as IGeneralization[])
    .map(gen => gen.specific)
    .filter(child => child.type === OntoumlType.CLASS_TYPE);
  const onlyClassChildren = classChildren.length === genSet.generalizations.length;

  if (!onlyClassChildren) return;

  const classParents = (genSet.generalizations as IGeneralization[])
    .map(gen => gen.general)
    .filter(parent => parent.type === OntoumlType.CLASS_TYPE);
  const onlyClassParent = classParents.length === genSet.generalizations.length;

  const uniqueParent = _.uniq(classParents).length === 1;

  if (!uniqueParent || !onlyClassParent) return;

  const parent = classParents[0] as IClass;

  if (genSet.isDisjoint) {
    const rigidOrAbstractChildren = (classChildren as IClass[]).filter(
      child => isRigid(child) || (isAbstract(child) && !isPrimitiveDatatype(child))
    );

    if (rigidOrAbstractChildren.length > 1) {
      const childrenNodes = rigidOrAbstractChildren.map(_class => namedNode(getUri(_class, options)));
      writer.addQuad(
        writer.blank(namedNode('rdf:type'), namedNode('owl:AllDisjointClasses')),
        namedNode('owl:members'),
        writer.list(childrenNodes)
      );
    }
  }

  if (genSet.isComplete && classChildren.length > 1) {
    const parentUri = getUri(parent, options);
    const childrenNodes = classChildren.map(_class => namedNode(getUri(_class, options)));

    writer.addQuad(
      namedNode(parentUri),
      namedNode('owl:equivalentClass'),
      writer.blank([
        {
          predicate: namedNode('rdf:type'),
          object: namedNode('owl:Class')
        },
        {
          predicate: namedNode('owl:unionOf'),
          object: writer.list(childrenNodes)
        }
      ])
    );
  }

  // const classGeneralizations = genSet.generalizations.filter(
  //   gen => gen.specific.type === OntoumlType.CLASS_TYPE
  // ) as IGeneralization[];

  // const children = classGeneralizations
  //   .map(gen => gen.specific)
  //   .filter(child => child.type == OntoumlType.CLASS_TYPE)
  //   .filter(child => isRigid(child as IClass) || (isAbstract(child as IClass) && !isPrimitiveDatatype));

  // // check if has at least 2 classes to avoid insconsistence
  // if (children.length > 1) {
  //   const childrenNodes = children.map(classElement => namedNode(getUri(classElement, options)));

  //   // add disjoint
  //   if (genSet.isDisjoint && (areRigid(children as IClass[]) || areAbstract(children as IClass[]))) {

  //   }

  //   // add complete

  // }
};
