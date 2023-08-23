import {
  OntoumlType,
  Project,
  Package,
  Classifier,
  RelationStereotype,
} from "..";

import { Relation } from "./relation";

export class NaryRelation extends Relation {
  constructor(
    project: Project,
    container: Package | undefined,
    members: Classifier<any, any>[],
  ) {
    super(project, container, members);

    if (members.length < 3) {
      throw new Error(
        "At least 3 classifiers are needed to create an n-ary relation.",
      );
    }
  }

  getAllowedStereotypes(): RelationStereotype[] {
    return [RelationStereotype.MATERIAL];
  }

  override toJSON(): any {
    const object = {
      type: OntoumlType.NARY_RELATION,
    };

    return { ...object, ...super.toJSON() };
  }
}
