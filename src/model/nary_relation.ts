import {
  OntoumlType,
  Project,
  Package,
  Classifier,
  RelationStereotype,
  Relation
} from '..';

/**
 * A {@link Relation} with three or more ends, connecting as many
 * classifiers at once. For example, a ternary relation `supplies` may
 * connect `Supplier`, `Product`, and `Customer`. In OntoUML, n-ary
 * relations can only be stereotyped as «material».
 */
export class NaryRelation extends Relation {
  constructor(project: Project, members: Classifier<any, any>[]) {
    super(project, members);

    if (members.length < 3) {
      throw new Error(
        'At least 3 classifiers are needed to create an n-ary relation.'
      );
    }
  }

  /**
   * Lists the stereotypes that OntoUML allows on n-ary relations, i.e.,
   * only «material».
   */
  getAllowedStereotypes(): RelationStereotype[] {
    return [RelationStereotype.MATERIAL];
  }

  override toJSON(): any {
    const object = {
      type: OntoumlType.NARY_RELATION
    };

    return { ...super.toJSON(), ...object };
  }
}
