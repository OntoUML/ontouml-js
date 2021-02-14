import { OntoumlType } from '@libs/ontouml';
import { ElementView, Relation, Path } from '..';

export class RelationView extends ElementView<Relation, Path> {
  constructor(base?: Partial<RelationView>) {
    super(OntoumlType.RELATION_VIEW, base);
  }

  createShape(): Path {
    return new Path();
  }
}
